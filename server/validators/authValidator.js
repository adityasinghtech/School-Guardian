const { z } = require('zod');
const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['Parent', 'Teacher']),
    schoolCode: z.string().min(1, 'School code is required'),
    admissionNumber: z.string().optional(),
    dob: z.string().optional()
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});
const updateProfileSchema = z.object({
    name: z.string().min(2).optional(),
    profileImage: z.string().optional()
});
const changePasswordSchema = z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6)
});
const forgotPasswordSchema = z.object({
    email: z.string().email()
});
const resetPasswordSchema = z.object({
    password: z.string().min(6)
});
module.exports = { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema };