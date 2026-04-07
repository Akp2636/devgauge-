const Project = require('../models/Project');
const User = require('../models/User');
const Rating = require('../models/Rating');

const SKILL_KEYWORDS = [
  'React','Next.js','Vue','Angular','TypeScript','JavaScript','Node.js','Express',
  'Python','Django','FastAPI','Flask','PostgreSQL','MongoDB','Redis','MySQL',
  'Docker','Kubernetes','AWS','GCP','Azure','GraphQL','REST','WebSockets',
  'Machine Learning','TensorFlow','PyTorch','Rust','Go','Java','Spring',
  'Tailwind CSS','CSS','HTML','Figma','CI/CD','Git','Linux','Nginx',
  'Prisma','Supabase','Firebase','Stripe','WebRTC','Three.js','Svelte','Remix',
  'tRPC','Drizzle','Turbo','Bun','Deno','Vite','Webpack','Babel',
];

const extractSkills = async (description) => {
  const desc = description.toLowerCase();
  const found = SKILL_KEYWORDS.filter(s => desc.includes(s.toLowerCase()));

  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your_')) {
    try {
      const { OpenAI } = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const res = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Extract tech skills from the project description. Return ONLY a JSON array of strings, no extra text.' },
          { role: 'user', content: description },
        ],
        max_tokens: 200,
      });
      const parsed = JSON.parse(res.choices[0].message.content);
      return Array.isArray(parsed) ? parsed : found;
    } catch { return found; }
  }

  return found.length > 0 ? found : ['JavaScript'];
};

const scoreContrib = (skills) => Math.min(50 + skills.length * 15 + Math.floor(Math.random() * 80), 350);

exports.submitProject = async (req, res) => {
  try {
    if (req.user.role === 'recruiter')
      return res.status(403).json({ message: 'Recruiters cannot submit projects.' });

    const { title, description, repoUrl, liveUrl } = req.body;
    if (!title || !description)
      return res.status(400).json({ message: 'Title and description are required.' });

    const skills = await extractSkills(description);
    const pts = scoreContrib(skills);

    const project = await Project.create({
      title, description, repoUrl, liveUrl, skills,
      userId: req.user._id,
      aiAnalysis: {
        complexity: pts > 200 ? 'High' : pts > 100 ? 'Medium' : 'Low',
        skillsExtracted: skills,
        scoreContribution: pts,
        summary: `Demonstrates proficiency in ${skills.slice(0, 3).join(', ')}.`,
      },
      status: 'analyzed',
    });

    const user = await User.findById(req.user._id);
    const prev = user.rating.score;
    user.rating.score = Math.min(prev + pts, 3000);
    user.skills = [...new Set([...user.skills, ...skills])];
    user.updateRank();
    await user.save();

    await Rating.create({
      userId: user._id, score: user.rating.score,
      previousScore: prev, change: pts,
      reason: `Project: ${title}`, projectId: project._id,
    });

    res.status(201).json({ project, updatedRating: user.rating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: 'analyzed' })
      .populate('userId', 'fullName rating')
      .sort({ createdAt: -1 }).limit(20);
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('userId', 'fullName rating skills');
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    await project.deleteOne();
    res.json({ message: 'Project deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
