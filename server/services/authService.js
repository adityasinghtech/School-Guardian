const User = require('../models/User');
const generateToken = require('../utils/generateJWT');
const crypto = require('crypto');

class AuthService {
    static async register(data) {
        const { name, email, password, role, schoolCode, admissionNumber, dob } = data;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new Error('User already exists with this email');
        }

        // Verify School Code
        const School = require('../models/School');
        const school = await School.findOne({ schoolCode });
        if (!school) {
            throw new Error('Invalid School Code. Please verify and try again.');
        }

        if (role === 'Parent') {
            if (!admissionNumber) {
                throw new Error('Admission number is required for Parent registration');
            }
            const Student = require('../models/Student');
            const query = { admissionNumber, schoolId: school._id };
            if (dob) {
                query.dob = new Date(dob); // Simple matching for now
            }
            const student = await Student.findOne(query);
            if (!student) {
                throw new Error('Could not find student record with the provided Admission Number.');
            }
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role,
            schoolId: role !== 'Admin' ? school._id : undefined,
        });

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            schoolId: user.schoolId,
            token: generateToken(user._id),
        };
    }

    static async login(email, password) {
        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (!user.isActive) {
            throw new Error('Your account has been deactivated');
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            schoolId: user.schoolId,
            profileImage: user.profileImage,
            token: generateToken(user._id),
        };
    }

    static async getProfile(userId) {
        const user = await User.findById(userId).populate('schoolId');
        if (!user) throw new Error('User not found');
        return user;
    }

    static async updateProfile(userId, updateData) {
        const user = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        });
        if (!user) throw new Error('User not found');
        return user;
    }

    static async changePassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId).select('+password');
        if (!user) throw new Error('User not found');

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) throw new Error('Incorrect current password');

        user.password = newPassword;
        await user.save();
        return true;
    }

    static async forgotPassword(email) {
        const user = await User.findOne({ email });
        if (!user) throw new Error('There is no user with that email');

        // Get reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        return resetToken;
    }

    static async resetPassword(resetToken, newPassword) {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) throw new Error('Invalid or expired token');

        // Set new password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        };
    }
}

module.exports = AuthService;