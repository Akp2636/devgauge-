const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    previousScore: {
      type: Number,
      default: 0,
    },
    change: {
      type: Number,
      default: 0,
    },
    reason: {
      type: String,
      default: 'Project submission',
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rating', ratingSchema);
