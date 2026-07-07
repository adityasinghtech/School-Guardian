const { z } = require('zod');
const createCommentSchema = z.object({
    message: z.string().min(1).max(500)
});
module.exports = { createCommentSchema };