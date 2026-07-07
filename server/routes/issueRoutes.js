const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// All issue routes require authentication
router.use(authMiddleware);

// Create Issue (with up to 5 images) & Get All Issues
router.route('/')
    .post(upload.array('images', 5), issueController.createIssue)
    .get(issueController.getIssues);

// Get, Update, and Delete single issue
router.route('/:id')
    .get(issueController.getIssueById)
    .put(issueController.updateIssue)
    .delete(issueController.deleteIssue);

module.exports = router;