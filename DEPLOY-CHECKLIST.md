# Deploy checklist — run before `git push`

## 1. Local test
- [ ] `npm run dev` works
- [ ] Admin login works
- [ ] Candidate upload works (.txt)
- [ ] HR analyze shows matches

## 2. Files ready
- [ ] `.env` is NOT in git (only `.env.example`)
- [ ] Team photos in `public/picture/` (optional)
- [ ] `package.json` has Next 14.2.35 and Prisma 5.22.0

## 3. GitHub
```powershell
cd C:\Users\Hasnain\Desktop\web
git init
git add .
git commit -m "Ready for Vercel"
git remote add origin https://github.com/YOUR_USER/smart-resume-ai.git
git push -u origin main
```

## 4. Neon
- [ ] Create project at neon.tech
- [ ] Copy **pooled** connection string

## 5. Vercel env vars
- [ ] DATABASE_URL
- [ ] AUTH_SECRET
- [ ] NEXT_PUBLIC_APP_URL (after first deploy)

## 6. Database (from PC)
```powershell
npm run db:push
npm run db:seed
```

## 7. Live test
- [ ] https://YOUR-PROJECT.vercel.app loads
- [ ] Admin login on live URL

Full guide: **VERCEL-DEPLOY.md**
