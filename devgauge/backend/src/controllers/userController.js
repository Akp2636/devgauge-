const User = require('../models/User');
const Project = require('../models/Project');
const Rating = require('../models/Rating');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const ratingHistory = await Rating.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(10);
    res.json({ user, projects, ratingHistory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, bio, github, skills, company } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, bio, github, skills, company },
      { new: true, runValidators: true }
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: 'candidate' })
      .select('fullName email rating skills avatar bio github')
      .sort({ 'rating.score': -1 })
      .limit(50);
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const projects = await Project.find({ userId: req.params.id }).sort({ createdAt: -1 });
    res.json({ user, projects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
