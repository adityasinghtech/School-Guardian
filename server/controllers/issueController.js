const { sendSuccess, sendError } = require('../utils/apiResponse');
const IssueService = require('../services/issueService');
const { createIssueSchema, updateIssueSchema } = require('../validators/issueValidator');

exports.createIssue = async (req, res, next) => {
    try {
        const validatedData = createIssueSchema.parse(req.body);
        const data = await IssueService.createIssue(validatedData, req.user, req.files);
        sendSuccess(res, 201, 'Issue reported successfully', data);
    } catch (error) {
        if (error.name === 'ZodError') {
            return sendError(res, 400, error.issues[0].message);
        }
        sendError(res, 400, error.message);
    }
};

exports.getIssues = async (req, res, next) => {
    try {
        const data = await IssueService.getIssues(req.query, req.user);
        sendSuccess(res, 200, 'Issues fetched successfully', data);
    } catch (error) {
        sendError(res, 400, error.message);
    }
};

exports.getIssueById = async (req, res, next) => {
    try {
        const data = await IssueService.getIssueById(req.params.id, req.user);
        sendSuccess(res, 200, 'Issue fetched successfully', data);
    } catch (error) {
        // If cast error (invalid ID)
        if (error.name === 'CastError') {
            return sendError(res, 400, 'Invalid Issue ID format');
        }
        sendError(res, 404, error.message);
    }
};

exports.updateIssue = async (req, res, next) => {
    try {
        const validatedData = updateIssueSchema.parse(req.body);
        const data = await IssueService.updateIssue(req.params.id, validatedData, req.user);
        sendSuccess(res, 200, 'Issue updated successfully', data);
    } catch (error) {
        if (error.name === 'ZodError') {
            return sendError(res, 400, error.issues[0].message);
        }
        if (error.name === 'CastError') {
            return sendError(res, 400, 'Invalid Issue ID format');
        }
        // Differentiate auth errors (403) from not found (404) or bad request (400)
        const statusCode = error.message.includes('authorized') ? 403 : 400;
        sendError(res, statusCode, error.message);
    }
};

exports.deleteIssue = async (req, res, next) => {
    try {
        await IssueService.deleteIssue(req.params.id, req.user);
        sendSuccess(res, 200, 'Issue deleted successfully');
    } catch (error) {
        if (error.name === 'CastError') {
            return sendError(res, 400, 'Invalid Issue ID format');
        }
        const statusCode = error.message.includes('authorized') ? 403 : 404;
        sendError(res, statusCode, error.message);
    }
};
