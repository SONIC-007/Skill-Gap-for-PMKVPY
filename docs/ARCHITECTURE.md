# Architecture & Tagged File Dependency Map

PMKVY Skill Gap Analyser runs behind **one unified Node server** (`http://localhost:3000`), while keeping **Frontend** (`Frontend/`) and **Backend** (`backend/`) strictly separated by folder and tagged by role.

```text
Browser (http://localhost:3000)
   │
   ├──► Express Backend Entry (backend/src/server.js)
   │       ├── GET  /health           ──► MongoDB readiness + GEMINI_API_KEY status
   │       ├── /api/*                 ──► Express routers (backend/src/routes/*.js)
   │       │                                  ├── JWT Auth (backend/src/middleware/auth.js)
   │       │                                  ├── Gemini AI + URL Fetcher (backend/src/services/aiAnalyser.js)
   │       │                                  └── Mongoose Models (backend/src/models/*.js) ──► MongoDB
   │       └── Everything else        ──► Next.js 16 App Router (Frontend/)
   │                                          └── Middleware guard (Frontend/src/middleware.js)
```

---

## 1. `[FRONTEND]` Files — What Each File Does & Uses

| Tag | File | Role / Feature | Uses Backend APIs & Frontend Modules |
|---|---|---|---|
| `[FRONTEND]` | `Frontend/src/app/layout.jsx` | Root HTML shell & fonts | `globals.css`, `components/providers.jsx` |
| `[FRONTEND]` | `Frontend/src/app/globals.css` | Minimal Slate/Indigo theme tokens & `.prepp-card` utilities | Imported by `app/layout.jsx` |
| `[FRONTEND]` | `Frontend/src/middleware.js` | Edge route protection (redirects unauth users to `/login`) | Reads `pmkvy_token` cookie set by `lib/api.js` |
| `[FRONTEND]` | `Frontend/src/lib/api.js` | Same-origin `apiFetch()`, Bearer token & `pmkvy_token` cookie helper | Used by all API-connected pages & `auth-context.jsx` |
| `[FRONTEND]` | `Frontend/src/lib/auth-context.jsx` | `AuthProvider` & `useSession()` React auth context | `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`, `lib/api.js` |
| `[FRONTEND]` | `Frontend/src/lib/document-parser.js` | Client-side `.txt`, `.md`, text `.pdf` resume parser | Used by `app/resume-analyser/page.jsx` |
| `[FRONTEND]` | `Frontend/src/components/providers.jsx` | App client wrapper | Wraps `AuthProvider` around `app/layout.jsx` |
| `[FRONTEND]` | `Frontend/src/components/layout/dashboard-layout.jsx` | Shared workspace frame & footer | `components/layout/sidebar.jsx`, `lib/auth-context.jsx` |
| `[FRONTEND]` | `Frontend/src/components/layout/sidebar.jsx` | `TopNavbar` navigation & user dropdown | `DashboardLayout`, `next/navigation` |
| `[FRONTEND]` | `Frontend/src/components/ui/*` | Reusable UI primitives (`button`, `card`, `input`, `badge`, `dialog`, `progress`, etc.) | Used across all Frontend pages |
| `[FRONTEND]` | `Frontend/src/app/page.jsx` | Public landing overview (CTAs routed through `/login`) | Static marketing page -> links to `/login?callbackUrl=...` |
| `[FRONTEND]` | `Frontend/src/app/login/page.jsx` | Sign-in form + 1-click Demo logins (`candidate@pmkvy.com`, `admin@pmkvy.com`) | `useSession().signInWithCredentials()` -> `POST /api/auth/login` |
| `[FRONTEND]` | `Frontend/src/app/register/page.jsx` | Candidate registration page | `apiFetch("/api/register")` -> `POST /api/register` |
| `[FRONTEND]` | `Frontend/src/app/forgot-password/page.jsx` | Demo account recovery instructions | Links to `/login` |
| `[FRONTEND]` | `Frontend/src/app/dashboard/page.jsx` | Candidate telemetry, proficiency charts & recent activity | `GET /api/dashboard`, `DashboardLayout`, `recharts` |
| `[FRONTEND]` | `Frontend/src/app/resume-analyser/page.jsx` | Dual-mode AI Resume Analyser (`By Job Role (QP-NOS)` & `By Job Link / JD (AI)`) | `GET/POST /api/ai-resume-analyser`, `POST /api/ai-resume-analyser/save`, `document-parser.js`, `useSession` |
| `[FRONTEND]` | `Frontend/src/app/assessment/page.jsx` | Domain-filtered Rating + MCQ skill assessment wizard | `GET /api/assessment`, `POST /api/assessment` |
| `[FRONTEND]` | `Frontend/src/app/skill-gap/page.jsx` | Quantitative skill gap matrix & comparison bar charts | `GET /api/skill-gap`, `recharts` |
| `[FRONTEND]` | `Frontend/src/app/courses/page.jsx` | PMKVY 4.0 training catalog, filters & enrollment | `GET /api/courses`, `POST /api/enroll` |
| `[FRONTEND]` | `Frontend/src/app/career-path/page.jsx` | Role readiness ranking & phased upskilling timeline | `GET /api/career` |
| `[FRONTEND]` | `Frontend/src/app/progress/page.jsx` | Course completion tracking (+15% skill boost) & timeline chart | `GET /api/progress`, `PUT /api/progress`, `recharts` |
| `[FRONTEND]` | `Frontend/src/app/profile/page.jsx` | Candidate bio, education, target role editor | `GET /api/profile`, `PUT /api/profile` |
| `[FRONTEND]` | `Frontend/src/app/admin/page.jsx` | Admin console KPIs, domain charts & recent candidates | `GET /api/admin/stats` (requires `ADMIN` role) |
| `[FRONTEND]` | `Frontend/src/app/admin/skills/page.jsx` | Admin skills CRUD registry | `GET/POST/DELETE /api/admin/skills` |
| `[FRONTEND]` | `Frontend/src/app/admin/job-roles/page.jsx` | Admin QP-NOS job roles CRUD | `GET/POST/DELETE /api/admin/job-roles` |
| `[FRONTEND]` | `Frontend/src/app/admin/courses/page.jsx` | Admin PMKVY courses CRUD | `GET/POST/DELETE /api/admin/courses` |
| `[FRONTEND]` | `Frontend/src/app/admin/candidates/page.jsx` | Admin candidate roster & enrollment inspection | `GET /api/admin/candidates` |

---

## 2. `[BACKEND]` Files — APIs, AI Engine & MongoDB Models

| Tag | File | Responsibility / Mount | Served To & Uses |
|---|---|---|---|
| `[BACKEND]` | `backend/src/server.js` | **Unified Server Entry** (`http://localhost:3000`): mounts Express `/api/*`, `/health`, and Next.js `Frontend/` handler | Uses `config/db.js`, all `routes/*.js`, `Frontend/` Next handler |
| `[BACKEND]` | `backend/src/config/db.js` | Pure MongoDB / Mongoose connector with local cooldown (`MONGODB_URI`) | Used by all routes, `aiAnalyser.js`, and `seed-mongoose.js` |
| `[BACKEND]` | `backend/src/middleware/auth.js` | JWT signing & verification (`requireAuth`, `requireAdmin`) | Used by `routes/*` (`Bearer` header or `pmkvy_token` cookie) |
| `[BACKEND]` | `backend/src/utils/validations.js` | Zod validation schemas (`registerSchema`, `loginSchema`, `profileSchema`) | Used by `routes/auth.js` |
| `[BACKEND]` | `backend/src/routes/auth.js` | `POST /api/auth/login`, `POST /api/register`, `GET /api/auth/me`, `POST /api/auth/logout` | Consumed by `login`, `register`, `auth-context`; uses `User`, `CandidateProfile` |
| `[BACKEND]` | `backend/src/routes/dashboard.js` | `GET /api/dashboard` | Consumed by `app/dashboard`; uses `CandidateSkill`, `CourseEnrollment`, `Assessment`, `LearningProgress` |
| `[BACKEND]` | `backend/src/routes/profile.js` | `GET` / `PUT /api/profile` | Consumed by `app/profile`; uses `User`, `CandidateProfile` |
| `[BACKEND]` | `backend/src/routes/assessment.js` | `GET` / `POST /api/assessment` | Consumed by `app/assessment`; uses `JobRole`, `AssessmentQuestion`, `Assessment`, `AssessmentResponse`, `CandidateSkill` |
| `[BACKEND]` | `backend/src/routes/skillGap.js` | `GET /api/skill-gap` | Consumed by `app/skill-gap`; uses `JobRole`, `Assessment`, `CandidateSkill` |
| `[BACKEND]` | `backend/src/routes/courses.js` | `GET /api/courses` | Consumed by `app/courses`; uses `TrainingCourse`, `CourseEnrollment`, `CandidateSkill` |
| `[BACKEND]` | `backend/src/routes/enroll.js` | `POST /api/enroll` | Consumed by `app/courses`; uses `CourseEnrollment` |
| `[BACKEND]` | `backend/src/routes/progress.js` | `GET` / `PUT /api/progress` (+15% skill boost on completion) | Consumed by `app/progress`; uses `CourseEnrollment`, `CourseSkill`, `CandidateSkill`, `LearningProgress` |
| `[BACKEND]` | `backend/src/routes/career.js` | `GET /api/career` | Consumed by `app/career-path`; uses `CandidateSkill`, `JobRole` |
| `[BACKEND]` | `backend/src/routes/resumeAnalyser.js` | `GET/POST /api/ai-resume-analyser` & `POST /api/ai-resume-analyser/save` | Consumed by `app/resume-analyser`; uses `services/aiAnalyser.js`, `User`, `JobRole`, `Skill`, `Assessment`, `CandidateSkill`, `LearningProgress`, `CandidateProfile` |
| `[BACKEND]` | `backend/src/services/aiAnalyser.js` | Google Gemini Flash/Gemma cascade (`GEMINI_API_KEY`), SSRF-safe public job link fetcher, word-boundary NOS fallback | Used by `routes/resumeAnalyser.js`; queries `JobRole`, `TrainingCourse` |
| `[BACKEND]` | `backend/src/routes/admin.js` | `GET /api/admin/stats`, CRUD `/skills`, `/job-roles`, `/courses`, `GET /candidates` | Consumed by `app/admin/*` (`requireAdmin`); uses all Mongoose admin models |
| `[BACKEND]` | `backend/src/models/*.js` | 13 Mongoose schemas (`User`, `CandidateProfile`, `Skill`, `JobRole`, `JobSkillRequirement`, `CandidateSkill`, `TrainingCourse`, `CourseSkill`, `CourseEnrollment`, `Assessment`, `AssessmentQuestion`, `AssessmentResponse`, `LearningProgress`) | Used across `backend/src/routes/*` and `seed-mongoose.js` |
| `[BACKEND]` | `backend/scripts/seed-mongoose.js` | Seeds MongoDB (`npm run seed`) with users, profiles, skills, assessment questions, roles, courses & demo telemetry | Executed before first run or after switching to MongoDB Atlas |
| `[BACKEND]` | `backend/scripts/start-prod.js` | Cross-platform production runner setting `NODE_ENV=production` | Used by root `npm start` |
