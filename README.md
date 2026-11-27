# PMKVY Skill Gap Analyser

AI-assisted **PMKVY 4.0 & NSQF Skill Gap Analysis Platform** built cleanly with **Next.js 16**, **Express.js**, **MongoDB (Mongoose)**, and **Google Gemini AI**

**LIVE LINK** -> https://skill-gap-for-pmkvpy.onrender.com

Both `Frontend/` and `backend/` are cleanly separated at the folder level and run behind **one unified single server** on `http://localhost:3000`.

---

## Folder Organization (`Frontend/` + `backend/` + `docs/`)

```text
├── Frontend/                  # [FRONTEND] Next.js 16 React UI, components, CSS tokens, client auth
├── backend/                   # [BACKEND]  Express API, MongoDB/Mongoose models, Gemini AI service, single-server entry
├── docs/                      # [DOCS]     Architecture & File Dependency Map, Deployment Guide, Design System
├── package.json               # Unified root scripts: dev, build, start, seed, install:all
├── .gitignore
└── README.md
```

👉 Full file-by-file tags and dependency matrix (**which page uses which API & Mongoose model**): see **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)**.

---

## Quick Map: Frontend Pages → Backend Endpoints

| `[FRONTEND]` Page | `[BACKEND]` Endpoint(s) Used | MongoDB Models Touched |
|---|---|---|
| `Frontend/src/app/login/page.jsx` | `POST /api/auth/login` | `User` |
| `Frontend/src/app/register/page.jsx` | `POST /api/register` | `User`, `CandidateProfile` |
| `Frontend/src/app/dashboard/page.jsx` | `GET /api/dashboard` | `CandidateSkill`, `CourseEnrollment`, `Assessment`, `LearningProgress` |
| `Frontend/src/app/resume-analyser/page.jsx` | `GET/POST /api/ai-resume-analyser`, `POST /api/ai-resume-analyser/save` | `JobRole`, `TrainingCourse`, `Assessment`, `CandidateSkill`, `LearningProgress`, `CandidateProfile` |
| `Frontend/src/app/assessment/page.jsx` | `GET/POST /api/assessment` | `JobRole`, `AssessmentQuestion`, `Assessment`, `AssessmentResponse`, `CandidateSkill` |
| `Frontend/src/app/skill-gap/page.jsx` | `GET /api/skill-gap` | `JobRole`, `Assessment`, `CandidateSkill` |
| `Frontend/src/app/courses/page.jsx` | `GET /api/courses`, `POST /api/enroll` | `TrainingCourse`, `CourseEnrollment`, `CandidateSkill` |
| `Frontend/src/app/career-path/page.jsx` | `GET /api/career` | `JobRole`, `CandidateSkill` |
| `Frontend/src/app/progress/page.jsx` | `GET/PUT /api/progress` | `CourseEnrollment`, `CourseSkill`, `CandidateSkill`, `LearningProgress` |
| `Frontend/src/app/profile/page.jsx` | `GET/PUT /api/profile` | `User`, `CandidateProfile` |
| `Frontend/src/app/admin/**` | `/api/admin/{stats,skills,job-roles,courses,candidates}` | All admin & telemetry collections |

---

## Run Locally (One Single Server on Port `3000`)

```bash
# 1. Configure backend/.env (MONGODB_URI, GEMINI_API_KEY, JWT_SECRET)
# 2. Install Frontend + backend dependencies
npm run install:all

# 3. Seed MongoDB collections & demo accounts
npm run seed

# 4. Start the unified single server (http://localhost:3000)
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Demo Accounts (Seeded via `npm run seed`)
- **Candidate:** `candidate@pmkvy.com` / `candidate123`
- **Admin:** `admin@pmkvy.com` / `admin123`

---

## Documentation
- **[Architecture & Tagged File Dependency Map](./docs/ARCHITECTURE.md)**
- **[Deployment Guide (MongoDB Atlas + Single Render Service)](./docs/DEPLOYMENT.md)**
- **[Design Tokens & UI Notes](./docs/DESIGN.md)**
