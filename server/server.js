const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const dotenv = require('dotenv');

// Import Configs
const validateEnv = require('./config/env');
const connectDB = require('./config/db');

// Import Middlewares
const { requestLogger } = require('./middlewares/requestLogger');
const { errorHandler } = require('./middlewares/errorHandler');
const { notFoundHandler } = require('./middlewares/notFoundHandler');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issueRoutes');
const repairRoutes = require('./routes/repairRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const commentRoutes = require('./routes/commentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const studentRoutes = require('./routes/studentRoutes');

// Initialize App
dotenv.config();
validateEnv(); // Ensure all required env variables are present

const app = express();

// Database Connection
connectDB();

// 1. Security Middlewares
app.use(helmet()); // Set security HTTP headers
app.use(cors()); // Enable CORS
// express-mongo-sanitize breaks Express 5
// app.use(mongoSanitize()); // Prevent NoSQL injection
// xss-clean breaks Express 5 because req.query is now a getter-only
// app.use(xss()); // Prevent XSS attacks
app.use(compression()); // Compress response bodies

// 2. Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// 3. Body Parsing & Logging
app.use(express.json({ limit: '10kb' })); // Body parser, limit payload size
app.use(requestLogger); // Morgan logging

// Serve static uploads folder for local image fallback
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/students', studentRoutes);

// Base Route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'School Facility Condition Reporting API is running securely.',
    });
});

// 5. Error Handling Middlewares
app.use(notFoundHandler); // Catch 404
app.use(errorHandler); // Global error handler

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
