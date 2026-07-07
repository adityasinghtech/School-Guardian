const { sendSuccess, sendError } = require('../utils/apiResponse');
const CommentService = require('../services/commentService');
const { z } = require('zod');

const commentSchema = z.object({
    message: z.string().min(1).max(500),
});

exports.getComments = async (req, res, next) => {
    try {
        const data = await CommentService.getComments(req.params.issueId, req.user);
        sendSuccess(res, 200, 'Comments fetched successfully', data);
    } catch (error) {
        if (error.name === 'CastError') return sendError(res, 400, 'Invalid Issue ID');
        const statusCode = error.message.includes('authorized') ? 403 : 404;
        sendError(res, statusCode, error.message);
    }
};

exports.addComment = async (req, res, next) => {
    try {
        const { message } = commentSchema.parse(req.body);
        const data = await CommentService.addComment(req.params.issueId, message, req.user);
        sendSuccess(res, 201, 'Comment added successfully', data);
    } catch (error) {
        if (error.name === 'ZodError') return sendError(res, 400, error.issues[0].message);
        if (error.name === 'CastError') return sendError(res, 400, 'Invalid Issue ID');
        const statusCode = error.message.includes('authorized') ? 403 : 404;
        sendError(res, statusCode, error.message);
    }
};
