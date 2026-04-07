const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    repoUrl: {
      type: String,
      default: '',
    },
    liveUrl: {
      type: String,
      default: '',
    },
    skills: [String],
    techStack: [String],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    aiAnalysis: {
      complexity: { type: String, default: 'Medium' },
      skillsExtracted: [String],
      scoreContribution: { type: Number, default: 0 },
      summary: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['pending', 'analyzed', 'verified'],
      default: 'pending',
    },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
