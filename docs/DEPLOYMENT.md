# Deployment Guide: MongoDB Atlas + Render

This repository is organized as two independent services backed by **MongoDB Atlas (Mongoose)**:
- `backend/` — Standalone Express.js REST API & Google Gemini AI service
- `Frontend/` — Standalone Next.js 16 React web application

---

## 1. MongoDB Atlas Setup (Free M0 Cluster)
1. Create a free cluster in MongoDB Atlas.
2. Under **Network Access**, allow access from Render (`0.0.0.0/0` or Render outbound IPs).
3. Under **Database Access**, create a database user with read/write access and copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@<cluster-url>/pmkvy?retryWrites=true&w=majority
   ```
4. Seed initial PMKVY skills, job roles, assessment questions, courses, and demo accounts (`candidate@pmkvy.com` / `admin@pmkvy.com`):
   ```bash
   cd backend
   npm install
   # Set MONGODB_URI in backend/.env first
   npm run seed
   ```

---

## 2. Deploy `backend/` on Render (Web Service)
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Health Check Path:** `/health`
- **Environment Variables:**
  - `PORT`: `5000` (or Render default)
  - `MONGODB_URI`: `mongodb+srv://...`
  - `GEMINI_API_KEY`: `<your shared Google Gemini API key>`
  - `JWT_SECRET`: `<strong random secret>`
  - `FRONTEND_URL`: `https://<your-frontend-service>.onrender.com`

---

## 3. Deploy `Frontend/` on Render (Web Service)
- **Root Directory:** `Frontend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Environment Variables:**
  - `NEXT_PUBLIC_API_URL`: `https://<your-backend-service>.onrender.com`
