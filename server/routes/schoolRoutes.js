const express = require('express');
const router = express.Router();
const { getSchools, registerSchool } = require('../controllers/schoolController');

router.get('/', getSchools);
router.post('/register', registerSchool);

module.exports = router;