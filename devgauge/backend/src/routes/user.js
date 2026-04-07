const express = require('express');
const { getProfile, updateProfile, getLeaderboard, getUserById } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/leaderboard', getLeaderboard);
router.get('/:id', getUserById);

module.exports = router;
