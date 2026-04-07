# DevGauge — Codeforces for Tech Recruitment

> Stop hiring resumes. Start hiring skill.

A full-stack platform that rates developers like competitive programmers — from **Newbie** to **Grandmaster** — based on verified skills and real projects.

---

## ⚡ Quick Start (without Docker)

### Prerequisites
- Node.js 18+
- MongoDB running locally **or** a MongoDB Atlas URI

### 1 — Backend
```bash
cd backend
npm install
cp .env.example .env          # fill in your MONGODB_URI + JWT_SECRET
npm run dev                   # → http://localhost:5000
```

### 2 — Frontend
```bash
cd frontend
npm install
cp .env.example .env.local    # set NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev                   # → http://localhost:3000
```

### 3 — Seed demo data (optional)
```bash
cd backend
npm run seed
# Creates 10 demo candidates + 1 recruiter, all with password: password123
```

---

## 🐳 Quick Start (with Docker)

```bash
# 1. Copy env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 2. Start everything
docker-compose up --build

# 3. Seed (optional, in a second terminal)
docker exec devgauge_backend node src/scripts/seed.js
```

---

## 📁 Project Structure

```
devgauge/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── projectController.js
│   │   │   └── recruiterController.js
│   │   ├── middleware/
│   │   │   ├── auth.js        # JWT protect + recruiterOnly
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   └── Rating.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── user.js
│   │   │   ├── project.js
│   │   │   └── recruiter.js
│   │   ├── scripts/
│   │   │   └── seed.js        # Demo data seeder
│   │   └── index.js
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── page.tsx            # Landing page
    │   ├── layout.tsx
    │   ├── auth/page.tsx       # Login / Sign Up
    │   ├── dashboard/page.tsx  # Candidate dashboard
    │   ├── recruiter/page.tsx  # Recruiter search
    │   ├── leaderboard/page.tsx
    │   ├── loading.tsx
    │   ├── error.tsx
    │   └── not-found.tsx
    ├── components/
    │   ├── Navbar.tsx
    │   ├── RankBadge.tsx
    │   ├── ProjectCard.tsx
    │   └── CandidateCard.tsx
    ├── lib/
    │   ├── api.ts              # All API calls
    │   ├── auth.tsx            # Auth context + hook
    │   └── ranks.ts            # Rank config + helpers
    ├── Dockerfile
    ├── .env.example
    └── package.json
```

---

## 🔑 Environment Variables

### Backend `.env`
| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 5000) |
| `MONGODB_URI` | **Yes** | MongoDB connection string |
| `JWT_SECRET` | **Yes** | Secret for signing JWT tokens (min 32 chars) |
| `JWT_EXPIRES_IN` | No | Token expiry (default: 7d) |
| `FRONTEND_URL` | No | Frontend URL for CORS (default: http://localhost:3000) |
| `OPENAI_API_KEY` | No | OpenAI key for real AI skill extraction |
| `NODE_ENV` | No | development or production |

### Frontend `.env.local`
| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | **Yes** | Backend API URL |

---

## 🏆 Rank System

| Rank | Min Score | Color |
|---|---|---|
| Newbie | 0 | Gray |
| Pupil | 800 | Green |
| Apprentice | 1,200 | Emerald |
| Specialist | 1,400 | Cyan |
| Expert | 1,600 | Blue |
| Candidate Master | 1,900 | Violet |
| Master | 2,100 | Purple |
| Grandmaster | 2,400 | Red |

---

## 📡 API Reference

### Auth
| Method | Path | Body | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | `{fullName, email, password, role}` | — |
| POST | `/api/auth/login` | `{email, password}` | — |
| GET | `/api/auth/me` | — | Bearer |

### Users
| Method | Path | Auth |
|---|---|---|
| GET | `/api/users/profile` | Bearer |
| PUT | `/api/users/profile` | Bearer |
| GET | `/api/users/leaderboard` | — |
| GET | `/api/users/:id` | — |

### Projects
| Method | Path | Auth |
|---|---|---|
| POST | `/api/projects` | Bearer (candidate) |
| GET | `/api/projects/my` | Bearer |
| GET | `/api/projects` | — |
| GET | `/api/projects/:id` | — |
| DELETE | `/api/projects/:id` | Bearer (owner) |

### Recruiter
| Method | Path | Query params | Auth |
|---|---|---|---|
| GET | `/api/recruiter/candidates` | `skill, minScore, maxScore, rank, page, limit` | Bearer (recruiter) |
| GET | `/api/recruiter/stats` | — | Bearer (recruiter) |

---

## 🤖 AI Skill Extraction

**Without** `OPENAI_API_KEY`: keyword matching scans project descriptions for 50+ known technologies.

**With** `OPENAI_API_KEY`: uses GPT-3.5-turbo to intelligently extract skills, classify complexity, and generate summaries.

---

## 🚀 Production Deployment

### Frontend → Vercel
1. Push `frontend/` to GitHub
2. Import project in Vercel dashboard
3. Set `NEXT_PUBLIC_API_URL` to your backend URL

### Backend → Railway / Render
1. Push `backend/` to GitHub
2. Set all env variables in dashboard
3. Deploy — start command: `npm start`

### Database → MongoDB Atlas
1. Create free cluster at https://cloud.mongodb.com
2. Create a DB user and allowlist `0.0.0.0/0`
3. Copy the connection string → `MONGODB_URI`
