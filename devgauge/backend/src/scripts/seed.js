/**
 * Seed script — creates sample users + projects for development/demo
 * Usage: node src/scripts/seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Rating = require('../models/Rating');

const CANDIDATES = [
  { fullName: 'Alex Rivera',    email: 'alex@demo.com',    skills: ['React','TypeScript','Node.js','PostgreSQL'],        score: 2100, rank: 'Candidate Master' },
  { fullName: 'Priya Sharma',   email: 'priya@demo.com',   skills: ['Python','Machine Learning','FastAPI','Docker'],     score: 1900, rank: 'Candidate Master' },
  { fullName: 'Marcus Johnson', email: 'marcus@demo.com',  skills: ['Go','Kubernetes','AWS','Redis'],                    score: 1750, rank: 'Expert'           },
  { fullName: 'Yuki Tanaka',    email: 'yuki@demo.com',    skills: ['Vue','GraphQL','MongoDB','TypeScript'],             score: 1620, rank: 'Expert'           },
  { fullName: 'Sara Okafor',    email: 'sara@demo.com',    skills: ['Rust','WebAssembly','Linux','CI/CD'],               score: 2350, rank: 'Master'           },
  { fullName: 'Daniel Park',    email: 'daniel@demo.com',  skills: ['Java','Spring','Docker','Kafka'],                   score: 1580, rank: 'Specialist'       },
  { fullName: 'Amira Hassan',   email: 'amira@demo.com',   skills: ['React','Next.js','Tailwind CSS','Prisma'],          score: 1420, rank: 'Specialist'       },
  { fullName: 'Leo Zhang',      email: 'leo@demo.com',     skills: ['Python','Django','PostgreSQL','Redis'],             score: 1300, rank: 'Apprentice'       },
  { fullName: 'Nina Volkov',    email: 'nina@demo.com',    skills: ['Angular','TypeScript','Azure','CI/CD'],             score: 1200, rank: 'Apprentice'       },
  { fullName: 'Omar Diallo',    email: 'omar@demo.com',    skills: ['Node.js','Express','MongoDB','Docker'],             score: 950,  rank: 'Pupil'            },
];

const SAMPLE_PROJECTS = [
  { title: 'Real-time Collaboration Platform', description: 'Built a Google Docs-style editor using React, WebSockets, Node.js, and Redis pub/sub. CRDT conflict resolution.', skills: ['React', 'WebSockets', 'Node.js', 'Redis'], complexity: 'High', pts: 280 },
  { title: 'ML Pipeline for Code Analysis',   description: 'Python and TensorFlow pipeline that analyzes GitHub repos using transformer models. Deployed on AWS with Docker and Kubernetes.', skills: ['Python', 'TensorFlow', 'Docker', 'Kubernetes', 'AWS'], complexity: 'High', pts: 320 },
  { title: 'High-performance REST API',        description: 'Go microservice handling 100k req/s with goroutines and Redis caching. PostgreSQL with connection pooling.', skills: ['Go', 'Redis', 'PostgreSQL'], complexity: 'High', pts: 310 },
  { title: 'E-commerce Platform',             description: 'Full-stack Next.js app with Stripe payments, Prisma ORM, and PostgreSQL. SSR for SEO.', skills: ['Next.js', 'TypeScript', 'Prisma', 'Stripe'], complexity: 'Medium', pts: 180 },
  { title: 'Distributed Task Queue',          description: 'Celery + Redis task queue with Django REST Framework. Handles async jobs, email, and exports.', skills: ['Python', 'Django', 'Redis', 'Celery'], complexity: 'Medium', pts: 200 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({ email: { $regex: /@demo\.com$/ } });
    console.log('Cleared old demo users');

    await User.create({
      fullName: 'Sarah Chen', email: 'recruiter@demo.com',
      password: 'password123', role: 'recruiter',
      company: 'TechCorp Inc.', rating: { score: 0, rank: 'Newbie' },
    });

    for (const c of CANDIDATES) {
      const user = await User.create({
        fullName: c.fullName, email: c.email,
        password: 'password123', role: 'candidate',
        skills: c.skills, bio: 'Senior engineer specializing in scalable systems.',
        github: `https://github.com/${c.fullName.split(' ').join('').toLowerCase()}`,
        rating: { score: c.score, rank: c.rank },
      });

      const proj = SAMPLE_PROJECTS[Math.floor(Math.random() * SAMPLE_PROJECTS.length)];
      const p = await Project.create({
        title: proj.title, description: proj.description,
        skills: proj.skills, userId: user._id,
        repoUrl: `https://github.com/${user.github?.split('/').pop()}/project`,
        aiAnalysis: { complexity: proj.complexity, skillsExtracted: proj.skills, scoreContribution: proj.pts, summary: `Demonstrates ${proj.skills.slice(0,2).join(' and ')}.` },
        status: 'analyzed',
      });
      await Rating.create({ userId: user._id, score: c.score, previousScore: c.score - proj.pts, change: proj.pts, reason: `Project: ${proj.title}`, projectId: p._id });
    }

    console.log('\nSeed complete!');
    console.log('Demo login password for all accounts: password123');
    console.log('Recruiter: recruiter@demo.com');
    CANDIDATES.forEach(c => console.log(`  ${c.email}  [${c.rank}]`));
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}
seed();
