const User = require('../models/User');

class AdminService {
    static async getUsers(query) {
        let filter = {};
        
        // Search by name or email
        if (query.search) {
            filter.$or = [
                { name: { $regex: query.search, $options: 'i' } },
                { email: { $regex: query.search, $options: 'i' } }
            ];
        }

        // Filter by role
        if (query.role) {
            filter.role = query.role;
        }

        // Filter by status
        if (query.isActive !== undefined) {
            filter.isActive = query.isActive === 'true';
        }

        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find(filter)
            .select('-password') // Ensure password is never sent
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(filter);

        return {
            users,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        };
    }

    static async updateUserRole(userId, newRole) {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        // Cannot change role of the last admin if this user is the only admin
        if (user.role === 'Admin' && newRole !== 'Admin') {
            const adminCount = await User.countDocuments({ role: 'Admin', isActive: true });
            if (adminCount <= 1) {
                throw new Error('Cannot change role of the last active Admin');
            }
        }

        user.role = newRole;
        await user.save();
        return user;
    }

    static async toggleUserStatus(userId, isActive) {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        if (user.role === 'Admin' && !isActive) {
            const adminCount = await User.countDocuments({ role: 'Admin', isActive: true });
            if (adminCount <= 1) {
                throw new Error('Cannot deactivate the last active Admin');
            }
        }

        user.isActive = isActive;
        await user.save();
        return user;
    }

    static async deleteUser(userId) {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        if (user.role === 'Admin') {
            const adminCount = await User.countDocuments({ role: 'Admin', isActive: true });
            if (adminCount <= 1) {
                throw new Error('Cannot delete the last Admin');
            }
        }

        // Soft delete could be just isActive = false, but if hard delete is requested:
        // Or perhaps the prompt said "Soft Delete users". Let's do a soft delete.
        user.isActive = false;
        user.isDeleted = true; // Assuming we add this field or just rely on isActive.
        // We'll rely on isActive for now as it acts as a soft delete for logins.
        await user.save();
        return true;
    }
}

module.exports = AdminService;
