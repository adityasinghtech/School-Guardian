const Issue = require('../models/Issue');

class IssueService {
    static async createIssue(data, user, files) {
        // Prepare images array from Cloudinary upload or local fallback
        const images = files && files.length > 0 ? files.map(file => {
            if (file.path && file.path.startsWith('http')) return file.path;
            const baseUrl = process.env.API_URL || 'http://localhost:5000';
            return `${baseUrl}/uploads/${file.filename}`;
        }) : [];

        // Admin might pass schoolId, but Parent/Teacher must use their own
        const schoolId = user.role !== 'Admin' ? user.schoolId : data.school;

        if (!schoolId) {
            throw new Error('School ID is required');
        }

        const issue = await Issue.create({
            ...data,
            school: schoolId,
            reportedBy: user._id,
            images,
        });

        return issue;
    }

    static async getIssues(query, user) {
        // Base filter based on role
        let filter = {};
        if (user.role !== 'Admin') {
            // Parent/Teacher can only see issues they reported or that belong to their school
            // As per requirements: "Can view only their own issues"
            filter.reportedBy = user._id;
        }

        // Apply additional filters from query
        if (query.category) filter.category = query.category;
        if (query.priority) filter.priority = query.priority;
        if (query.status) filter.status = query.status;
        if (query.school && user.role === 'Admin') filter.school = query.school;
        if (query.reporter && user.role === 'Admin') filter.reportedBy = query.reporter;

        // Date range
        if (query.startDate || query.endDate) {
            filter.createdAt = {};
            if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
            if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
        }

        // Pagination
        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // Sorting
        let sortObj = { createdAt: -1 }; // Default Newest
        if (query.sort === 'oldest') sortObj = { createdAt: 1 };
        else if (query.sort === 'priority') {
            // MongoDB doesn't easily sort by custom enum order without aggregation, 
            // but we can sort alphabetically or rely on front-end for now.
            sortObj = { priority: 1 }; 
        } else if (query.sort === 'status') sortObj = { status: 1 };

        const issues = await Issue.find(filter)
            .populate('reportedBy', 'name email profileImage')
            .populate('assignedTo', 'name email')
            .populate('school', 'schoolName')
            .sort(sortObj)
            .skip(skip)
            .limit(limit);

        const total = await Issue.countDocuments(filter);

        return {
            issues,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        };
    }

    static async getIssueById(issueId, user) {
        const issue = await Issue.findById(issueId)
            .populate('reportedBy', 'name email profileImage')
            .populate('assignedTo', 'name email')
            .populate('school', 'schoolName address')
            .populate({
                path: 'comments',
                populate: { path: 'user', select: 'name role profileImage' }
            });

        if (!issue) {
            throw new Error('Issue not found');
        }

        // Authorization check
        if (user.role !== 'Admin' && issue.reportedBy._id.toString() !== user._id.toString()) {
            throw new Error('Not authorized to view this issue');
        }

        return issue;
    }

    static async updateIssue(issueId, data, user) {
        const issue = await Issue.findById(issueId);
        if (!issue) throw new Error('Issue not found');

        // Authorization logic
        if (user.role !== 'Admin') {
            if (issue.reportedBy.toString() !== user._id.toString()) {
                throw new Error('Not authorized to update this issue');
            }
            if (issue.status !== 'Pending') {
                throw new Error('You can only update pending issues');
            }
            // Non-admins cannot change status or assignment
            delete data.status;
            delete data.assignedTo;
            delete data.priority; // Often priority might also be restricted
        }

        const updatedIssue = await Issue.findByIdAndUpdate(issueId, data, {
            new: true,
            runValidators: true,
        }).populate('reportedBy', 'name email').populate('assignedTo', 'name');

        return updatedIssue;
    }

    static async deleteIssue(issueId, user) {
        const issue = await Issue.findById(issueId);
        if (!issue) throw new Error('Issue not found');

        // Authorization logic
        if (user.role !== 'Admin') {
            if (issue.reportedBy.toString() !== user._id.toString()) {
                throw new Error('Not authorized to delete this issue');
            }
            if (issue.status !== 'Pending') {
                throw new Error('You can only delete pending issues');
            }
        }

        await issue.deleteOne();
        return true;
    }
}

module.exports = IssueService;