# PMKVY Skill Gap Analyser

AI-assisted **PMKVY 4.0 & NSQF Skill Gap Analysis Platform** restructured cleanly into decoupled **Frontend**, **backend**, and **docs** modules powered purely by **MongoDB (Mongoose)** and **Google Gemini AI**.

---

## Repository Structure

```text
├── Frontend/        # Next.js 16 + React 19 UI (App Router, Tailwind CSS v4, JWT auth)
├── backend/         # Express.js REST API, Mongoose schemas, JWT auth, Gemini AI service
├── docs/            # Architecture, design tokens (DESIGN.md), and Render deployment guide
├── .gitignore
└── README.md
```

---

## Local Development Setup

### 1. Backend (`backend/`, Port `5000`)
```bash
cd backend
cp .env.example .env
# Fill in MONGODB_URI, GEMINI_API_KEY, and JWT_SECRET inside backend/.env
npm install
npm run seed
npm run dev
```

### 2. Frontend (`Frontend/`, Port `3000`)
```bash
cd Frontend
cp .env.example .env.local
# Keep NEXT_PUBLIC_API_URL="http://localhost:5000"
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Demo Accounts (Seeded via `backend/scripts/seed-mongoose.js`)
- **Candidate:** `candidate@pmkvy.com` / `candidate123`
- **Admin:** `admin@pmkvy.com` / `admin123`

---

## Documentation
- [Deployment Guide (MongoDB Atlas + Render)](./docs/DEPLOYMENT.md)
- [Design Tokens & UI Notes](./docs/DESIGN.md)
