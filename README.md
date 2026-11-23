# PMKVY Skill Gap Analyser

A modern full-stack web application designed for students, job seekers, and candidates enrolled in **Pradhan Mantri Kaushal Vikas Yojana (PMKVY)** to identify gaps between their existing competencies and industry job requirements, calculate personalized skill gap percentages, receive tailored course recommendations, explore high-match career paths, and track their learning progress over time.

---

## 🚀 Key Modules & Capabilities

1. **Authentication & Role-Based Access**
   - Secure registration, email/password credential login with bcrypt hashing.
   - Dual-role architecture: **CANDIDATE** (job seeker dashboard & assessments) and **ADMIN** (curricula, job roles, and candidate oversight).
   - Candidate profile management with personal, educational, and target career fields.

2. **Interactive Skill Assessment**
   - Domain-based filtering across 7 key national industries:
     - Web Development
     - Data Science
     - Artificial Intelligence
     - Cybersecurity
     - Cloud Computing
     - Digital Marketing
     - Electric Vehicle Technology
   - Step-by-step assessment wizard evaluating **Technical Skills** and **Soft Skills** separately via interactive proficiency sliders and scenario questions.

3. **Transparent Skill Gap Calculation Engine**
   - Rigorous mathematical formula:
     $$\text{Individual Skill Gap (\%)} = \frac{\text{Required Proficiency} - \text{Candidate Proficiency}}{\text{Required Proficiency}} \times 100$$
   - Weighted overall skill gap percentage calculation.
   - Distinct classification into:
     - **Meeting Requirements** ($\le 10\%$ gap)
     - **Needs Improvement** ($10\% - 50\%$ gap)
     - **Missing / High Priority** ($> 50\%$ gap)
   - Visual comparison charts using Recharts with side-by-side required vs. assessed proficiency bars.

4. **PMKVY Training Recommendations**
   - Dynamic course ranking prioritized by the candidate's highest deficiency scores.
   - Filtering by domain and difficulty level (Beginner, Intermediate, Advanced).
   - Detailed course syllabus metadata: provider, duration, eligibility, and competencies covered.
   - 1-click course enrollment with instant progress synchronization.
   - Clearly marked illustrative/sample data disclaimers.

5. **Career Path Guidance**
   - Job role readiness scoring ($\%$ match based on verified skills).
   - Side-by-side matched competencies vs. missing prerequisites.
   - Multi-phase learning roadmaps (Foundations $\rightarrow$ Applied Frameworks $\rightarrow$ Placement/Certification).

6. **Learning Progress & Competency Tracking**
   - Track active course enrollments and mark modules completed.
   - Automatic $+15\%$ proficiency boost to related skills upon course completion.
   - Historical learning progress charts showing competency growth velocity.

7. **Comprehensive Admin Dashboard**
   - Overview metrics: total candidates, active assessments, registered job roles, and course offerings.
   - Skills distribution by domain and most assessed competencies charts.
   - Full CRUD management for standardized **Skills**, **Job Roles**, and **Training Courses**.
   - Candidate directory with latest assessment results and enrollment statistics.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Radix UI primitives, Lucide React icons, Recharts data visualization.
- **Backend**: Next.js API Route Handlers, TypeScript, NextAuth.js v5 beta, Bcrypt.js password hashing, Zod validation.
- **Database & ORM**: Prisma ORM with SQLite (zero-config, immediate local execution) & PostgreSQL schema ready for production deployment.

---

## 📋 Pre-Seeded Demo Credentials

The database comes fully populated with 35+ skills, 10 job roles, assessment questions, 15 courses, and pre-configured accounts:

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Candidate** | `candidate@pmkvy.com` | `candidate123` | Pre-assessed for Full Stack Developer role with active enrollments and progress |
| **Administrator** | `admin@pmkvy.com` | `admin123` | Full access to manage skills, roles, courses, and view candidate directory |

---

## 💻 Quick Start & Installation

### 1. Clone & Install Dependencies

```bash
cd pmkvy-skill-gap-analyser
npm install
```

### 2. Environment Configuration

The `.env` file is pre-configured with a local database:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="pmkvy-skill-gap-analyser-super-secret-key-2024"
NEXTAUTH_URL="http://localhost:3000"
```

For PostgreSQL in production, see the **PostgreSQL Setup** section below.

### 3. Database Migration & Seeding

Sync the database schema and populate realistic PMKVY sample data:

```bash
# Push Prisma schema to the database
npx prisma db push

# Seed the database with 35+ skills, 10 job roles, courses, and demo candidates
npx ts-node prisma/seed.ts
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐘 Switching to PostgreSQL (Optional / Production)

To use PostgreSQL instead of SQLite:

1. Update `.env`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/pmkvy_skill_gap?schema=public"
   ```
2. Update the `datasource` in `prisma/schema.prisma` (or copy from `prisma/schema.postgresql.prisma`):
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Run migrations and seed:
   ```bash
   npx prisma db push
   npx ts-node prisma/seed.ts
   ```

---

## 📂 Project Architecture

```
pmkvy-skill-gap-analyser/
├── prisma/
│   ├── schema.prisma               # Prisma schema (SQLite zero-config)
│   ├── schema.postgresql.prisma    # PostgreSQL production schema
│   ├── seed.ts                     # Database seeder (35 skills, 10 roles, 15 courses, demo users)
│   └── dev.db                      # Local SQLite database
├── src/
│   ├── app/
│   │   ├── page.tsx                # Modern SaaS Landing page with hero, how-it-works, domains
│   │   ├── layout.tsx              # Root HTML & Providers layout
│   │   ├── globals.css             # Tailwind v4 styles
│   │   ├── login/                  # Candidate & Admin sign-in
│   │   ├── register/               # Candidate self-registration
│   │   ├── forgot-password/        # Password reset request interface
│   │   ├── dashboard/              # Candidate analytics dashboard with Recharts
│   │   ├── assessment/             # Multi-step skill assessment module
│   │   ├── skill-gap/              # Core gap analysis engine & breakdown table
│   │   ├── courses/                # PMKVY recommended courses catalog & enrollment
│   │   ├── career-path/            # Career recommendations & learning roadmaps
│   │   ├── progress/               # Progress velocity charts & module tracking
│   │   ├── profile/                # Candidate profile management
│   │   ├── admin/
│   │   │   ├── page.tsx            # Admin KPI dashboard & analytics
│   │   │   ├── skills/             # Skills CRUD management
│   │   │   ├── job-roles/          # Job roles & requirement configuration
│   │   │   ├── courses/            # Course catalog management
│   │   │   └── candidates/         # Candidate oversight directory
│   │   └── api/                    # 14 RESTful Next.js API endpoints
│   ├── components/
│   │   ├── layout/                 # Sidebar and DashboardLayout
│   │   ├── ui/                     # Reusable Shadcn/Radix UI components
│   │   └── providers.tsx           # NextAuth SessionProvider
│   ├── lib/
│   │   ├── db.ts                   # Prisma client singleton
│   │   ├── auth.ts                 # NextAuth credentials handler & JWT callbacks
│   │   ├── utils.ts                # Skill gap math calculations & styling helpers
│   │   └── validations.ts          # Zod validation schemas
│   └── middleware.ts               # Edge-compatible route guard & role authorization
```

---

## 🔒 Security & Validation

- Passwords securely hashed with **bcryptjs** (12 salt rounds).
- Edge-compatible authentication middleware guarding protected candidate and admin routes.
- Strict server-side input validation via **Zod** on all API payloads.
- Role-based authorization verifying `ADMIN` privileges for destructive administrative actions.
- Client credentials and secrets strictly kept on the server side.

---

## 📜 Disclaimer
This application is an educational software engineering project modeled after the Pradhan Mantri Kaushal Vikas Yojana (PMKVY) guidelines to illustrate skill gap analysis methodologies. The course offerings, sector skill council references, and competency benchmarks are illustrative demonstrations.
