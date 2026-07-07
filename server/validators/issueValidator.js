const { z } = require('zod');

const issueCategories = [
    'Furniture', 'Electricity', 'Water Supply', 'Toilet', 'Sanitation', 
    'Roof', 'Classroom', 'Playground', 'Boundary Wall', 'Computer Lab', 
    'Science Lab', 'Library', 'Sports', 'Other'
];

const createIssueSchema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(10),
    category: z.enum(issueCategories),
    priority: z.enum(['Critical', 'High', 'Medium', 'Low']),
    location: z.string().min(2),
    school: z.string().optional() // Extracted from user role or passed explicitly
});

const updateIssueSchema = z.object({
    title: z.string().min(5).max(100).optional(),
    description: z.string().min(10).optional(),
    category: z.enum(issueCategories).optional(),
    priority: z.enum(['Critical', 'High', 'Medium', 'Low']).optional(),
    location: z.string().min(2).optional(),
    status: z.enum(['Pending', 'Accepted', 'Assigned', 'In Progress', 'Completed', 'Verified', 'Rejected']).optional(),
    assignedTo: z.string().optional()
});

module.exports = { createIssueSchema, updateIssueSchema };