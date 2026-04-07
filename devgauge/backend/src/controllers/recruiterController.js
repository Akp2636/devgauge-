const User = require('../models/User');

exports.getCandidates = async (req, res) => {
  try {
    const { skill, minScore, maxScore, rank, page = 1, limit = 12 } = req.query;
    const filter = { role: 'candidate' };

    if (skill) filter.skills = { $regex: new RegExp(skill, 'i') };
    if (rank) filter['rating.rank'] = rank;
    if (minScore || maxScore) {
      filter['rating.score'] = {};
      if (minScore) filter['rating.score'].$gte = Number(minScore);
      if (maxScore) filter['rating.score'].$lte = Number(maxScore);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(filter);
    const candidates = await User.find(filter)
      .select('fullName email rating skills bio github avatar createdAt')
      .sort({ 'rating.score': -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ candidates, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await User.countDocuments({ role: 'candidate' });
    const ranks = ['Newbie', 'Pupil', 'Apprentice', 'Specialist', 'Expert', 'Candidate Master', 'Master', 'Grandmaster'];
    const rankDistribution = await Promise.all(
      ranks.map(async (rank) => ({
        rank,
        count: await User.countDocuments({ role: 'candidate', 'rating.rank': rank }),
      }))
    );
    res.json({ totalCandidates: total, rankDistribution });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
