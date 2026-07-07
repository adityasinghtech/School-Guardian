const { sendSuccess, sendError } = require('../utils/apiResponse');
const RepairService = require('../services/repairService');
const { z } = require('zod');

// Validators
const assignStaffSchema = z.object({
    issueId: z.string(),
    staffId: z.string(),
});

const updateRepairStatusSchema = z.object({
    status: z.enum(['In Progress', 'Completed', 'Verified', 'Rejected']),
    remarks: z.string().optional(),
});

exports.getRepairs = async (req, res, next) => {
    try {
        const data = await RepairService.getRepairs(req.query, req.user);
        sendSuccess(res, 200, 'Repairs fetched successfully', data);
    } catch (error) {
        sendError(res, 400, error.message);
    }
};

exports.getRepairById = async (req, res, next) => {
    try {
        const data = await RepairService.getRepairById(req.params.id, req.user);
        sendSuccess(res, 200, 'Repair fetched successfully', data);
    } catch (error) {
        if (error.name === 'CastError') return sendError(res, 400, 'Invalid Repair ID format');
        const statusCode = error.message.includes('authorized') ? 403 : 404;
        sendError(res, statusCode, error.message);
    }
};

exports.assignStaff = async (req, res, next) => {
    try {
        const { issueId, staffId } = assignStaffSchema.parse(req.body);
        const data = await RepairService.assignStaff(issueId, staffId, req.user);
        sendSuccess(res, 201, 'Staff assigned successfully', data);
    } catch (error) {
        if (error.name === 'ZodError') return sendError(res, 400, error.issues[0].message);
        const statusCode = error.message.includes('authorized') ? 403 : 400;
        sendError(res, statusCode, error.message);
    }
};

exports.updateRepairStatus = async (req, res, next) => {
    try {
        const { status, remarks } = updateRepairStatusSchema.parse(req.body);
        const data = await RepairService.updateRepairStatus(req.params.id, status, remarks, req.user, req.files);
        sendSuccess(res, 200, 'Repair status updated successfully', data);
    } catch (error) {
        if (error.name === 'ZodError') return sendError(res, 400, error.issues[0].message);
        if (error.name === 'CastError') return sendError(res, 400, 'Invalid ID format');
        const statusCode = error.message.includes('authorized') ? 403 : 400;
        sendError(res, statusCode, error.message);
    }
};

exports.deleteRepair = async (req, res, next) => {
    try {
        await RepairService.deleteRepair(req.params.id, req.user);
        sendSuccess(res, 200, 'Repair deleted successfully');
    } catch (error) {
        if (error.name === 'CastError') return sendError(res, 400, 'Invalid Repair ID format');
        const statusCode = error.message.includes('authorized') ? 403 : 404;
        sendError(res, statusCode, error.message);
    }
};
