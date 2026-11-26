# Deployment Guide: MongoDB Atlas + Render (Single Unified Server)

This repository keeps `Frontend/`, `backend/`, and `docs/` cleanly organized while running from **one unified Node.js server** on a single port (`PORT`, default `3000`). You only need **1 Render Web Service**.

---

## 1. MongoDB Atlas Setup (Free M0 Cluster)
1. Create a free cluster in MongoDB Atlas.
2. Under **Network Access**, allow access from Render (`0.0.0.0/0` or Render outbound IPs).
3. Under **Database Access**, create a database user and copy your URI:
   ```text
   mongodb+srv://<username>:<password>@<cluster-url>/pmkvy?retryWrites=true&w=majority
   ```
4. Seed initial PMKVY skills, job roles, assessment questions, courses, and demo accounts:
   ```bash
   # Set MONGODB_URI in backend/.env first
   npm run install:all
   npm run seed
   ```

---

## 2. Deploy on Render (1 Web Service)
- **Root Directory:** leave empty (repository root)
- **Build Command:** `npm run install:all && npm run build`
- **Start Command:** `npm start`
- **Health Check Path:** `/health`
- **Environment Variables:**
  - `MONGODB_URI`: `mongodb+srv://...`
  - `GEMINI_API_KEY`: `<your shared Google Gemini API key>`
  - `JWT_SECRET`: `<strong random secret>`
  - `FRONTEND_URL`: `https://<your-render-service>.onrender.com`
