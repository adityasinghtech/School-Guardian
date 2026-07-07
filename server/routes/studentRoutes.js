const express = require('express');
const router = express.Router();
const { addStudent, getStudents } = require('../controllers/studentController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware('Admin'));

router.route('/')
    .post(addStudent)
    .get(getStudents);

module.exports = router;
