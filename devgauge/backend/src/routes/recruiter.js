const express = require('express');
const { getCandidates, getStats } = require('../controllers/recruiterController');
const { protect, recruiterOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/candidates', protect, recruiterOnly, getCandidates);
router.get('/stats', protect, recruiterOnly, getStats);

module.exports = router;
