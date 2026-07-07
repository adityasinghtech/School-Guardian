const { z } = require('zod');
// Usually notifications are created internally, but if needed via API:
const createNotificationSchema = z.object({
    user: z.string(),
    title: z.string().min(2),
    message: z.string().min(2)
});
module.exports = { createNotificationSchema };