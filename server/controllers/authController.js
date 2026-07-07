const { sendSuccess, sendError } = require('../utils/apiResponse');
const AuthService = require('../services/authService');
const { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validators/authValidator');

exports.register = async (req, res, next) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const data = await AuthService.register(validatedData);
        sendSuccess(res, 201, 'User registered successfully', data);
    } catch (error) {
        if (error.name === 'ZodError') {
            return sendError(res, 400, error.issues[0].message);
        }
        sendError(res, 400, error.message);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const data = await AuthService.login(email, password);
        sendSuccess(res, 200, 'Logged in successfully', data);
    } catch (error) {
        if (error.name === 'ZodError') {
            return sendError(res, 400, error.issues[0].message);
        }
        sendError(res, 401, error.message);
    }
};

exports.getProfile = async (req, res, next) => {
    try {
        const data = await AuthService.getProfile(req.user.id);
        sendSuccess(res, 200, 'Profile fetched successfully', data);
    } catch (error) {
        sendError(res, 404, error.message);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const validatedData = updateProfileSchema.parse(req.body);
        const data = await AuthService.updateProfile(req.user.id, validatedData);
        sendSuccess(res, 200, 'Profile updated successfully', data);
    } catch (error) {
        if (error.name === 'ZodError') {
            return sendError(res, 400, error.issues[0].message);
        }
        sendError(res, 400, error.message);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
        await AuthService.changePassword(req.user.id, currentPassword, newPassword);
        sendSuccess(res, 200, 'Password changed successfully');
    } catch (error) {
        if (error.name === 'ZodError') {
            return sendError(res, 400, error.issues[0].message);
        }
        sendError(res, 400, error.message);
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = forgotPasswordSchema.parse(req.body);
        const resetToken = await AuthService.forgotPassword(email);
        
        // In a real application, send an email here instead of returning the token in response
        // For testing/development, we return it.
        sendSuccess(res, 200, 'Password reset token generated', { resetToken });
    } catch (error) {
        if (error.name === 'ZodError') {
            return sendError(res, 400, error.issues[0].message);
        }
        sendError(res, 404, error.message);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { password } = resetPasswordSchema.parse(req.body);
        const data = await AuthService.resetPassword(req.params.resetToken, password);
        sendSuccess(res, 200, 'Password reset successfully', data);
    } catch (error) {
        if (error.name === 'ZodError') {
            return sendError(res, 400, error.issues[0].message);
        }
        sendError(res, 400, error.message);
    }
};

exports.logout = async (req, res, next) => {
    // JWT is stateless on the server side. 
    // Client should clear the token from storage.
    sendSuccess(res, 200, 'Logged out successfully');
};
