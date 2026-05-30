# Smart Resume AI — Vercel deployment guide

Deploy online **free** with:

- **Vercel** (hosting) → `https://your-project.vercel.app`
- **Neon** (PostgreSQL database) → free tier
- **GitHub** (code)

Total cost for FYP demo: **$0** (no Hostinger domain required).

---

## Before you deploy — checklist

- [ ] Project runs locally: `npm run dev` → http://localhost:3000
- [ ] `.env` works with Neon `DATABASE_URL`
- [ ] `npm run db:push` and `npm run db:seed` succeeded
- [ ] Admin login works locally
- [ ] Team photos in `public/picture/` (optional)
- [ ] **Never commit `.env`** to GitHub

---

## Step 1 — Push code to GitHub

### Option A (recommended): `web` folder = entire repo

1. Create GitHub repo: `smart-resume-ai`
2. Copy **contents** of `C:\Users\Hasnain\Desktop\web` into the repo (not the parent folder)
3. In PowerShell:

```powershell
cd C:\Users\Hasnain\Desktop\web
git init
git add .
git commit -m "Smart Resume AI ready for Vercel"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smart-resume-ai.git
git push -u origin main
```

### Option B: whole PC folder

If repo root is not `web`, set **Root Directory = `web`** in Vercel project settings.

---

## Step 2 — Create Neon database

1. Go to [https://neon.tech](https://neon.tech) → sign up
2. **New Project** → name: `smart-resume-ai`
3. Open **Connection details**
4. Copy **Pooled connection** string (important for Vercel)

Example:

```
postgresql://neondb_owner:xxxxx@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

Use the string with **`-pooler`** in the hostname for `DATABASE_URL` on Vercel.

---

## Step 3 — Deploy on Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Sign in with **GitHub**
3. **Import** your `smart-resume-ai` repository
4. Settings:

| Setting | Value |
|---------|--------|
| Framework | Next.js (auto) |
| Root Directory | empty (if repo is `web` contents) |
| Build Command | `npm run build` |
| Install Command | `npm install` |
| Node.js Version | **20.x** (Project Settings → General) |

5. **Environment Variables** — add before first deploy:

| Name | Value | Environments |
|------|--------|--------------|
| `DATABASE_URL` | Neon **pooled** connection string | Production, Preview, Development |
| `AUTH_SECRET` | Long random string (32+ chars) | Production, Preview, Development |

Generate secret (PowerShell):

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

6. Click **Deploy** and wait ~2–4 minutes.

---

## Step 4 — After first deploy

1. Copy your live URL, e.g. `https://smart-resume-ai.vercel.app`
2. Vercel → Project → **Settings** → **Environment Variables**
3. Add:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://smart-resume-ai.vercel.app` (your real URL, no `/` at end) |

4. **Redeploy**: Deployments → ⋯ → **Redeploy**

---

## Step 5 — Create database tables (one time)

Run from your PC (same Neon URL as Vercel):

```powershell
cd C:\Users\Hasnain\Desktop\web

# Paste Neon pooled URL into .env as DATABASE_URL, then:
npm run db:push
npm run db:seed
```

Default admin after seed:

- Email: `admin@smartresume.ai`
- Password: `Admin@123`

---

## Step 6 — Test live site

| Role | How |
|------|-----|
| **Admin** | Login with seed credentials |
| **HR** | Admin → Hire HR |
| **Candidate** | Register on site → upload `.txt` or `.docx` resume |
| **AI** | HR → post job → Analyze → **Run AI matching** |

Share with professors: **Vercel URL** + admin login.

---

## Environment variables summary

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL pooled URL |
| `AUTH_SECRET` | Yes | JWT session secret |
| `NEXT_PUBLIC_APP_URL` | Yes (after deploy) | Full site URL |
| `SEED_ADMIN_EMAIL` | No | Only for `db:seed` locally |
| `SEED_ADMIN_PASSWORD` | No | Only for `db:seed` locally |

---

## Updating the site later

```powershell
git add .
git commit -m "Update"
git push
```

Vercel redeploys automatically.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails on Prisma | Ensure `prisma` is in `dependencies`; check build logs |
| Login fails on live site | Run `npm run db:push` and `npm run db:seed` against Neon |
| Database connection error | Use **pooled** Neon URL; include `?sslmode=require` |
| HR sees 0 resumes | Candidate must upload on **live** URL (same Neon DB) |
| Resume upload fails | Use `.txt` or `.docx`; keep file under 4 MB |
| Team images missing | Add JPGs to `public/picture/` and push to GitHub |
| `AUTH_SECRET is not set` | Add env var in Vercel → Redeploy |

---

## Project stack (Vercel)

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, Tailwind |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 5 |
| Auth | JWT cookie sessions |
| AI matching | TypeScript TF-IDF (serverless) |
| PDF text | unpdf |
| Word text | mammoth |

---

## Cost

| Service | Cost |
|---------|------|
| Vercel Hobby | Free |
| Neon free tier | Free |
| Custom domain | Optional |

**Live URL example:** `https://smart-resume-ai.vercel.app`
