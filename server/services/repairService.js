const Repair = require('../models/Repair');
const Issue = require('../models/Issue');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');

class RepairService {
    // Shared logging and notification helper
    static async logAndNotify(user, action, issueId, remarks = null, oldStatus = null, newStatus = null) {
        const issue = await Issue.findById(issueId).populate('reportedBy');
        if (!issue) return;

        // Create Activity Log
        await ActivityLog.create({
            user: user._id,
            action: action,
            module: 'Repair',
            issueId: issueId,
            oldValue: oldStatus,
            newValue: newStatus,
            remarks: remarks,
        });

        // Determine Notification details
        let title, message, type;
        if (action === 'Staff Assigned') {
            title = 'Repair Assigned';
            message = `Staff has been assigned to your issue: ${issue.title}`;
            type = 'Assigned';
        } else if (action === 'Status Changed' || action === 'Repair Completed') {
            title = 'Repair Status Updated';
            message = `Your issue '${issue.title}' status changed to ${newStatus}`;
            type = newStatus === 'Completed' ? 'Resolved' : 'Status Updated';
        } else if (action === 'Issue Verified') {
            title = 'Repair Verified';
            message = `Your issue '${issue.title}' has been verified by Admin.`;
            type = 'System';
        }

        if (title && message) {
            await Notification.create({
                user: issue.reportedBy._id,
                title,
                message,
                type,
                issueId: issueId,
            });
        }
    }

    static async getRepairs(query, user) {
        let filter = {};
        if (user.role !== 'Admin') {
            // Non-admins shouldn't really query all repairs globally without context
            // But if they do, we can filter to their reported issues by finding issues first
            const userIssues = await Issue.find({ reportedBy: user._id }).select('_id');
            filter.issue = { $in: userIssues.map(i => i._id) };
        }

        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const repairs = await Repair.find(filter)
            .populate({
                path: 'issue',
                populate: { path: 'reportedBy', select: 'name email' }
            })
            .populate('assignedStaff', 'name email')
            .populate('verifiedBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Repair.countDocuments(filter);

        return {
            repairs,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        };
    }

    static async getRepairById(repairId, user) {
        const repair = await Repair.findById(repairId)
            .populate({
                path: 'issue',
                populate: { path: 'reportedBy', select: 'name email' }
            })
            .populate('assignedStaff', 'name email')
            .populate('verifiedBy', 'name email');
        
        if (!repair) throw new Error('Repair not found');

        if (user.role !== 'Admin' && repair.issue.reportedBy._id.toString() !== user._id.toString()) {
            throw new Error('Not authorized to view this repair');
        }

        return repair;
    }

    static async assignStaff(issueId, staffId, user) {
        if (user.role !== 'Admin') throw new Error('Not authorized');

        const issue = await Issue.findById(issueId);
        if (!issue) throw new Error('Issue not found');

        let repair = await Repair.findOne({ issue: issueId });
        if (!repair) {
            repair = await Repair.create({
                issue: issueId,
                assignedStaff: staffId,
                repairStatus: 'Assigned'
            });
        } else {
            repair.assignedStaff = staffId;
            repair.repairStatus = 'Assigned';
            await repair.save();
        }

        issue.status = 'Assigned';
        issue.assignedTo = staffId;
        await issue.save();

        await this.logAndNotify(user, 'Staff Assigned', issueId, null, issue.status, 'Assigned');

        return repair;
    }

    static async updateRepairStatus(repairId, newStatus, remarks, user, files) {
        if (user.role !== 'Admin') throw new Error('Not authorized');

        let repair = await Repair.findById(repairId).populate('issue').catch(() => null);
        if (!repair) {
            repair = await Repair.findOne({ issue: repairId }).populate('issue');
        }
        
        let oldStatus = 'Pending';

        if (!repair) {
            // Auto-create a repair document if admin updates status directly
            const issue = await Issue.findById(repairId);
            if (!issue) throw new Error('Issue not found');
            
            oldStatus = issue.status;
            
            repair = await Repair.create({
                issue: repairId,
                assignedStaff: user._id, // Default to admin who clicked it
                repairStatus: newStatus
            });
            repair.issue = issue;
        } else {
            oldStatus = repair.repairStatus;
            repair.repairStatus = newStatus;
        }
        
        if (remarks) repair.remarks = remarks;

        if (newStatus === 'Completed') {
            repair.completionDate = Date.now();
            if (files && files.length > 0) {
                repair.afterRepairImages = files.map(file => {
                    if (file.path && file.path.startsWith('http')) return file.path;
                    const baseUrl = process.env.API_URL || 'http://localhost:5000';
                    return `${baseUrl}/uploads/${file.filename}`;
                });
            }
        } else if (newStatus === 'Verified') {
            repair.verifiedBy = user._id;
        }

        await repair.save();

        const issue = await Issue.findById(repair.issue._id);
        issue.status = newStatus;
        await issue.save();

        const actionType = newStatus === 'Completed' ? 'Repair Completed' : (newStatus === 'Verified' ? 'Issue Verified' : 'Status Changed');
        await this.logAndNotify(user, actionType, issue._id, remarks, oldStatus, newStatus);

        return repair;
    }
    
    static async deleteRepair(repairId, user) {
        if (user.role !== 'Admin') throw new Error('Not authorized');
        
        const repair = await Repair.findById(repairId);
        if (!repair) throw new Error('Repair not found');

        // Optional: Reset issue status
        await Issue.findByIdAndUpdate(repair.issue, { status: 'Pending', assignedTo: null });
        
        await repair.deleteOne();
        return true;
    }
}

module.exports = RepairService;