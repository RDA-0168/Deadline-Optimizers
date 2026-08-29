# 🚀 RailMark AI — Complete Online Hosting & Deployment Guide

This guide covers **3 easy ways** to host your RailMark AI application online for free:

---

## ⚡ Method 1: Instant Live Public URL (10 Seconds — No Signup Required)

If you need a **live online HTTPS link right now** (for demoing to judges, testing on a mobile device camera, or sharing with teammates):

### Option A: 1-Click Launch (Easiest)
Simply double-click `start-online-tunnel.bat` or run:
```powershell
.\start-online-tunnel.ps1
```

### Option B: Manual Command
1. Start the unified server in one terminal:
   ```bash
   node railmark-backend/dist/server.js
   ```
2. In a second terminal, run:
   ```bash
   npx -y @cloudflare/cloudflared tunnel --url http://localhost:5000
   ```
   *(Or using LocalTunnel: `npx -y localtunnel --port 5000`)*

3. **Done!** Cloudflare / LocalTunnel will print a public HTTPS link (e.g. `https://random-name.trycloudflare.com`). Anyone worldwide can open this link on their mobile browser, inspect fittings, and scan QR codes in real-time!

---

## 🌐 Method 2: 100% Free 24/7 Cloud Hosting on Render.com (Recommended)

Host the **entire full-stack application (Frontend + Backend + Database)** under a single free public URL (`https://railmark-ai.onrender.com`).

### Step-by-Step Instructions:

1. **Push your code to GitHub**:
   - Initialize a git repo and push the `SIH DEMO` folder to your GitHub account:
     ```bash
     git init
     git add .
     git commit -m "Deploy RailMark AI"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/railmark-ai.git
     git push -u origin main
     ```

2. **Deploy on Render**:
   - Go to [https://dashboard.render.com/](https://dashboard.render.com/) and sign up / log in with GitHub.
   - Click **New +** → **Web Service**.
   - Connect your `railmark-ai` GitHub repository.
   - Configure the following settings:
     - **Name**: `railmark-ai`
     - **Runtime**: `Node`
     - **Build Command**: `npm run build`
     - **Start Command**: `npm start`
     - **Instance Type**: `Free`
   - Under **Environment Variables**, add:
     - `NODE_ENV` = `production`
     - `DB_TYPE` = `memory`
     - `CORS_ORIGIN` = `*`
     - `JWT_SECRET` = `railmark_secure_jwt_key_2026_sih`
   - Click **Create Web Service**.

3. **Done!** In ~2 minutes, Render will provide a live public HTTPS URL (e.g. `https://railmark-ai.onrender.com`).

---

## ⚡ Method 3: Deploy Frontend on Vercel + Backend on Render

If you prefer lightning-fast CDN caching for the React frontend on **Vercel** and the REST API backend on **Render**:

### Step 1: Deploy Backend to Render
1. Create a Web Service on Render pointing to your repo.
2. Root Directory: `railmark-backend`
3. Build Command: `npm install`
4. Start Command: `node dist/server.js`
5. Note your backend URL (e.g. `https://railmark-backend.onrender.com`).

### Step 2: Deploy Frontend to Vercel
1. Go to [https://vercel.com/](https://vercel.com/) and log in with GitHub.
2. Click **Add New Project** → Import your repository.
3. Set **Root Directory** to: `railmark-ai 1st/railmark-ai`
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://railmark-backend.onrender.com`
5. Click **Deploy**.

---

## 🔑 Default Login Credentials for Live Testing

- **Admin Account**:
  - Username / Email: `admin@railmark.demo`
  - Password: `admin123`
- **Inspector Account**:
  - Username / Email: `inspector@railmark.demo`
  - Password: `demo123`
