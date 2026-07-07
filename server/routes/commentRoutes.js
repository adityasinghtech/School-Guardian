const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.route('/:issueId')
    .get(commentController.getComments)
    .post(commentController.addComment);

module.exports = router;
