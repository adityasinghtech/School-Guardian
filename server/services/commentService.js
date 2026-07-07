const Comment = require('../models/Comment');
const Issue = require('../models/Issue');
const Notification = require('../models/Notification');
const Repair = require('../models/Repair');

class CommentService {
    static async getComments(issueId, user) {
        const issue = await Issue.findById(issueId);
        if (!issue) throw new Error('Issue not found');

        // Check auth: Parent/Teacher can only see comments if it's their issue
        if (user.role !== 'Admin') {
            if (issue.reportedBy.toString() !== user._id.toString()) {
                // If it's repair staff, they should be able to see it, but we only have 3 roles for now
                // "Parent, Teacher, Admin" - wait, user mentioned "Repair Staff permissions".
                // Did we add a Repair Staff role? "Maintenance Staff" - wait, roles are "Parent, Teacher, Admin".
                // The requirements say "Assign maintenance staff". Often maintenance staff is just another user role,
                // but if they didn't explicitly add it to the enum, Admin might just assign it to any User.
                // Let's assume Admin assigns it.
                
                // Allow if user is the assigned staff
                const repair = await Repair.findOne({ issue: issueId });
                const isAssignedStaff = repair && repair.assignedStaff.toString() === user._id.toString();

                if (!isAssignedStaff && issue.reportedBy.toString() !== user._id.toString()) {
                    throw new Error('Not authorized to view comments for this issue');
                }
            }
        }

        const comments = await Comment.find({ issue: issueId })
            .populate('user', 'name role profileImage')
            .sort({ createdAt: 1 }); // Oldest first for chat history

        return comments;
    }

    static async addComment(issueId, message, user) {
        const issue = await Issue.findById(issueId);
        if (!issue) throw new Error('Issue not found');

        // Auth check
        if (user.role !== 'Admin') {
            const repair = await Repair.findOne({ issue: issueId });
            const isAssignedStaff = repair && repair.assignedStaff.toString() === user._id.toString();

            if (!isAssignedStaff && issue.reportedBy.toString() !== user._id.toString()) {
                throw new Error('Not authorized to comment on this issue');
            }
        }

        const comment = await Comment.create({
            issue: issueId,
            user: user._id,
            message,
        });

        // Add to Issue's comments array (assuming Issue has it, else we just query Comments directly)
        if (!issue.comments) issue.comments = [];
        issue.comments.push(comment._id);
        await issue.save();

        // Notification Logic
        // If Parent/Teacher comments, notify Admin/AssignedStaff
        // If Admin/Staff comments, notify Parent/Teacher
        const notificationReceivers = new Set();
        
        if (user._id.toString() !== issue.reportedBy.toString()) {
            notificationReceivers.add(issue.reportedBy.toString());
        }

        const repair = await Repair.findOne({ issue: issueId });
        if (repair && repair.assignedStaff && user._id.toString() !== repair.assignedStaff.toString()) {
            notificationReceivers.add(repair.assignedStaff.toString());
        }

        const notifyPromises = Array.from(notificationReceivers).map(receiverId => {
            return Notification.create({
                user: receiverId,
                title: 'New Comment',
                message: `New comment on issue: ${issue.title}`,
                type: 'New Comment',
                issueId: issueId,
            });
        });

        await Promise.all(notifyPromises);

        return await comment.populate('user', 'name role profileImage');
    }
}

module.exports = CommentService;
