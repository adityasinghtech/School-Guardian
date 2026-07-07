const express = require('express');
const router = express.Router();
const repairController = require('../controllers/repairController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.use(authMiddleware);

router.route('/')
    .get(repairController.getRepairs)
    .post(repairController.assignStaff); // Admin only, creates or assigns repair

router.route('/:id')
    .get(repairController.getRepairById)
    .put(upload.array('images', 5), repairController.updateRepairStatus) // Admin only
    .delete(repairController.deleteRepair); // Admin only

module.exports = router;