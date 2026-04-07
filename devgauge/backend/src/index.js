const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const projectRoutes = require('./routes/project');
const recruiterRoutes = require('./routes/recruiter');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

// ─── Core Middleware ───────────────────────────────────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      "http://localhost:3000",
      "https://devgauge.vercel.app"
    ];

    if (!origin || allowed.includes(origin) || origin.includes("vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting on auth routes
app.use('/api/auth', rateLimiter(20, 15 * 60 * 1000)); // 20 req / 15 min

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/projects',  projectRoutes);
app.use('/api/recruiter', recruiterRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'DevGauge API is running',
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found.` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Database + Server Start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀  DevGauge API → http://localhost:${PORT}`);
      console.log(`🌍  Environment  → ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received — closing server gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});
