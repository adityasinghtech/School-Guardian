const { z } = require('zod');
const createSchoolSchema = z.object({
    schoolName: z.string().min(2),
    schoolCode: z.string().min(2),
    address: z.string().min(5),
    principalName: z.string().min(2),
    contactEmail: z.string().email(),
    contactPhone: z.string().min(10)
});
module.exports = { createSchoolSchema };