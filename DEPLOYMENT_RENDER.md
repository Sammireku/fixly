# Hosting Fixly on Render — Complete Deployment Guide

This guide walks you through deploying **Fixly** (Full-Stack React SPA + Express Server + Vite + Firebase) to **Render** (https://render.com) as a Web Service.

---

## 1. Architecture Overview
- **Runtime**: Node.js Web Service (Express `server.ts` entrypoint)
- **Frontend**: Vite SPA built to `/dist`
- **Backend API Routes**: Mounted on Express server (`/api/*`)
- **Port Handling**: Dynamic `process.env.PORT` provided by Render environment
- **State & Persistence**: Integrated Firebase Auth / Firestore & Local Storage fallback

---

## 2. Prerequisites
1. A **Render Account** (Free tier available at [render.com](https://render.com)).
2. A **GitHub / GitLab repository** containing the Fixly codebase.
3. Your **Firebase / Gemini API Keys** (from Google AI Studio or Firebase Console).

---

## 3. Render Web Service Configuration

### Step 1: Create New Web Service
1. Log into your **Render Dashboard**.
2. Click **New +** → **Web Service**.
3. Connect your GitHub/GitLab repository containing Fixly.

### Step 2: Configure Build & Runtime Settings
In the Render Web Service creation form, specify:

| Setting | Recommended Value |
| :--- | :--- |
| **Name** | `fixly-ghana` (or your choice) |
| **Region** | Frankfurt (eu-central-1) or nearest to Ghana |
| **Branch** | `main` |
| **Root Directory** | Leave blank (workspace root) |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` (or `node server.ts` via `tsx`) |
| **Instance Type** | Free / Starter |

---

## 4. Environment Variables Setup
On the Render Web Service page, scroll down to **Environment Variables** and add the following keys:

| Environment Variable | Description | Example / Source |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment flag | `production` |
| `PORT` | Set automatically by Render | (Do not override, default ~10000) |
| `GEMINI_API_KEY` | Key for Google AI Studio / Gemini API | Generated from Google AI Studio |
| `APP_URL` | Your Render hosted URL | `https://fixly-ghana.onrender.com` |

---

## 5. `package.json` Build & Start Scripts Verification
Ensure your `package.json` contains:
```json
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build",
    "start": "tsx server.ts",
    "lint": "tsc --noEmit"
  }
}
```

---

## 6. Express Server (`server.ts`) Port Binding Configuration
Ensure `server.ts` listens dynamically to `process.env.PORT`:
```typescript
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Fixly Express Server running on port ${PORT}`);
});
```

---

## 7. Verifying Deployment & Custom Domains
1. Render will run `npm install && npm run build` and launch `npm run start`.
2. Once deployed, Render will mark status as **Live** and issue an SSL HTTPS domain (e.g. `https://fixly-ghana.onrender.com`).
3. You can optionally attach a custom domain (e.g. `https://fixly.gh` or `https://app.fixly.com`) under **Settings → Custom Domains** in Render.

---

## 8. Troubleshooting
- **Build Fails (`vite: command not found`)**: Ensure `vite` is in `dependencies` or `devDependencies` and `npm install` runs before `npm run build`.
- **Port Conflict / Timeout**: Ensure Express binds to `0.0.0.0` and listens to `process.env.PORT`.
- **Firebase Permission Error**: Verify that your Render domain (`*.onrender.com`) is added to **Firebase Console → Authentication → Authorized Domains**.
