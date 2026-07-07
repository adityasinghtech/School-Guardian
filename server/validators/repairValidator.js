const { z } = require('zod');
const createRepairSchema = z.object({
    issue: z.string(),
    assignedStaff: z.string()
});
module.exports = { createRepairSchema };