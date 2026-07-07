const { sendSuccess, sendError } = require('../utils/apiResponse');
const AdminService = require('../services/adminService');

exports.getUsers = async (req, res, next) => {
    try {
        const data = await AdminService.getUsers(req.query);
        sendSuccess(res, 200, 'Users fetched successfully', data);
    } catch (error) {
        sendError(res, 400, error.message);
    }
};

exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!['Parent', 'Teacher', 'Admin'].includes(role)) {
            return sendError(res, 400, 'Invalid role provided');
        }
        const data = await AdminService.updateUserRole(req.params.id, role);
        sendSuccess(res, 200, 'User role updated successfully', { user: { id: data._id, role: data.role } });
    } catch (error) {
        if (error.name === 'CastError') return sendError(res, 400, 'Invalid User ID');
        sendError(res, 400, error.message);
    }
};

exports.toggleUserStatus = async (req, res, next) => {
    try {
        const { isActive } = req.body;
        if (typeof isActive !== 'boolean') {
            return sendError(res, 400, 'isActive must be a boolean');
        }
        const data = await AdminService.toggleUserStatus(req.params.id, isActive);
        sendSuccess(res, 200, `User ${isActive ? 'activated' : 'deactivated'} successfully`, { user: { id: data._id, isActive: data.isActive } });
    } catch (error) {
        if (error.name === 'CastError') return sendError(res, 400, 'Invalid User ID');
        sendError(res, 400, error.message);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        await AdminService.deleteUser(req.params.id);
        sendSuccess(res, 200, 'User deleted (soft) successfully');
    } catch (error) {
        if (error.name === 'CastError') return sendError(res, 400, 'Invalid User ID');
        sendError(res, 400, error.message);
    }
};
