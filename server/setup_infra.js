const fs = require('fs');
const path = require('path');

const files = {
  // Config
  'config/db.js': `const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error(\`Error: \${error.message}\`);
    process.exit(1);
  }
};

module.exports = connectDB;`,
  'config/cloudinary.js': `const cloudinary = require('cloudinary').v2;

const connectCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
};

module.exports = connectCloudinary;`,
  'config/env.js': `const dotenv = require('dotenv');
dotenv.config();

const validateEnv = () => {
    const required = ['MONGO_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
    required.forEach((key) => {
        if (!process.env[key]) {
            console.error(\`FATAL ERROR: \${key} is not defined in environment variables.\`);
            process.exit(1);
        }
    });
};

module.exports = validateEnv;`,
  '.env.example': `PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret`,

  // Middlewares
  'middlewares/authMiddleware.js': `const authMiddleware = (req, res, next) => {
    // TODO: Implement JWT verification
    next();
};
module.exports = { authMiddleware };`,
  'middlewares/roleMiddleware.js': `const roleMiddleware = (...roles) => {
    return (req, res, next) => {
        // TODO: Implement role checking
        next();
    };
};
module.exports = { roleMiddleware };`,
  'middlewares/errorHandler.js': `const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
module.exports = { errorHandler };`,
  'middlewares/notFoundHandler.js': `const notFoundHandler = (req, res, next) => {
    const error = new Error(\`Not Found - \${req.originalUrl}\`);
    res.status(404);
    next(error);
};
module.exports = { notFoundHandler };`,
  'middlewares/asyncHandler.js': `const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
module.exports = { asyncHandler };`,
  'middlewares/uploadMiddleware.js': `const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'school-guardian',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
});

const upload = multer({ storage });
module.exports = upload;`,
  'middlewares/requestLogger.js': `const morgan = require('morgan');
// We can use morgan directly in server.js, or export a customized format here
const requestLogger = morgan('dev');
module.exports = { requestLogger };`,

  // Validators
  'validators/authValidator.js': `const { z } = require('zod');
const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['Parent', 'Teacher']),
    schoolId: z.string().optional()
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});
module.exports = { registerSchema, loginSchema };`,
  'validators/schoolValidator.js': `const { z } = require('zod');
const createSchoolSchema = z.object({
    schoolName: z.string().min(2),
    schoolCode: z.string().min(2),
    address: z.string().min(5),
    principalName: z.string().min(2),
    contactEmail: z.string().email(),
    contactPhone: z.string().min(10)
});
module.exports = { createSchoolSchema };`,
  'validators/issueValidator.js': `const { z } = require('zod');
const createIssueSchema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(10),
    category: z.string(),
    priority: z.enum(['Critical', 'High', 'Medium', 'Low']),
    location: z.string().min(2),
    school: z.string()
});
module.exports = { createIssueSchema };`,
  'validators/repairValidator.js': `const { z } = require('zod');
const createRepairSchema = z.object({
    issue: z.string(),
    assignedStaff: z.string()
});
module.exports = { createRepairSchema };`,
  'validators/commentValidator.js': `const { z } = require('zod');
const createCommentSchema = z.object({
    message: z.string().min(1).max(500)
});
module.exports = { createCommentSchema };`,
  'validators/notificationValidator.js': `const { z } = require('zod');
// Usually notifications are created internally, but if needed via API:
const createNotificationSchema = z.object({
    user: z.string(),
    title: z.string().min(2),
    message: z.string().min(2)
});
module.exports = { createNotificationSchema };`,

  // Utilities
  'utils/generateIssueId.js': `const generateIssueId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
    return \`ISS-\${timestamp}-\${randomStr}\`;
};
module.exports = generateIssueId;`,
  'utils/generateJWT.js': `const generateToken = (id) => {
    // TODO: Implement JWT generation
    return 'skeleton-token';
};
module.exports = generateToken;`,
  'utils/apiResponse.js': `const sendSuccess = (res, statusCode, message, data = null) => {
    res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

const sendError = (res, statusCode, message) => {
    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = { sendSuccess, sendError };`,
  'utils/pagination.js': `const getPaginationOptions = (req) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};
module.exports = { getPaginationOptions };`,
  'utils/constants.js': `module.exports = {
    ROLES: {
        ADMIN: 'Admin',
        TEACHER: 'Teacher',
        PARENT: 'Parent'
    },
    ISSUE_STATUS: {
        PENDING: 'Pending',
        IN_PROGRESS: 'In Progress',
        COMPLETED: 'Completed'
    }
};`,

  // Controllers (Empty)
  'controllers/authController.js': `// Auth Controller`,
  'controllers/issueController.js': `// Issue Controller`,
  'controllers/repairController.js': `// Repair Controller`,
  'controllers/schoolController.js': `// School Controller`,
  'controllers/adminController.js': `// Admin Controller`,
  'controllers/notifController.js': `// Notification Controller`,

  // Routes (Empty)
  'routes/authRoutes.js': `const express = require('express');\nconst router = express.Router();\nmodule.exports = router;`,
  'routes/issueRoutes.js': `const express = require('express');\nconst router = express.Router();\nmodule.exports = router;`,
  'routes/repairRoutes.js': `const express = require('express');\nconst router = express.Router();\nmodule.exports = router;`,
  'routes/schoolRoutes.js': `const express = require('express');\nconst router = express.Router();\nmodule.exports = router;`,
  'routes/adminRoutes.js': `const express = require('express');\nconst router = express.Router();\nmodule.exports = router;`,
  'routes/notifRoutes.js': `const express = require('express');\nconst router = express.Router();\nmodule.exports = router;`,

  // Services (Empty)
  'services/authService.js': `// Auth Service`,
  'services/issueService.js': `// Issue Service`,
  'services/repairService.js': `// Repair Service`,
  'services/notificationService.js': `// Notification Service`,
};

// Create dirs if not exist
const dirs = ['config', 'middlewares', 'validators', 'utils', 'controllers', 'routes', 'services'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

Object.entries(files).forEach(([filepath, content]) => {
  fs.writeFileSync(path.join(__dirname, filepath), content);
});

console.log('Backend infrastructure created successfully.');
