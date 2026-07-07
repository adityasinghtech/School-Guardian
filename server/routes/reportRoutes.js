const express = require('express');
const router = express.Router();
const { exportIssues } = require('../controllers/reportController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

router.get('/export', authMiddleware, roleMiddleware('Admin'), exportIssues);

module.exports = router;
