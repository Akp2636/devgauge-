const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['candidate', 'recruiter'],
      default: 'candidate',
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    skills: [String],
    rating: {
      score: { type: Number, default: 0 },
      rank: {
        type: String,
        enum: ['Newbie', 'Pupil', 'Apprentice', 'Specialist', 'Expert', 'Candidate Master', 'Master', 'Grandmaster'],
        default: 'Newbie',
      },
    },
    company: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate rank based on score
userSchema.methods.updateRank = function () {
  const score = this.rating.score;
  if (score >= 2400) this.rating.rank = 'Grandmaster';
  else if (score >= 2100) this.rating.rank = 'Master';
  else if (score >= 1900) this.rating.rank = 'Candidate Master';
  else if (score >= 1600) this.rating.rank = 'Expert';
  else if (score >= 1400) this.rating.rank = 'Specialist';
  else if (score >= 1200) this.rating.rank = 'Apprentice';
  else if (score >= 800) this.rating.rank = 'Pupil';
  else this.rating.rank = 'Newbie';
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
