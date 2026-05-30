# Smart Resume AI

AI-powered resume screening and job matching — **Next.js** app ready for **Vercel**.

## Features

- Admin, HR, and Candidate role-based dashboards
- Resume upload (PDF, DOCX, TXT)
- AI job–resume matching with score bars and skill gap
- Contact form, team page, light/dark theme

## Requirements

- Node.js **18 or 20** LTS
- Neon PostgreSQL account (free)

## Local setup

```powershell
cd C:\Users\Hasnain\Desktop\web
copy .env.example .env
# Edit .env — DATABASE_URL + AUTH_SECRET

npm install
npm run db:push
npm run db:seed
npm run dev
```

Open http://localhost:3000

**Admin (after seed):** `admin@smartresume.ai` / `Admin@123`

## Deploy to Vercel

See **[VERCEL-DEPLOY.md](./VERCEL-DEPLOY.md)** for full step-by-step instructions.

Quick summary:

1. Push this folder to GitHub  
2. Create Neon database → copy pooled `DATABASE_URL`  
3. Import repo on [vercel.com](https://vercel.com)  
4. Set `DATABASE_URL`, `AUTH_SECRET`, then `NEXT_PUBLIC_APP_URL`  
5. Run `npm run db:push` and `npm run db:seed` from your PC  

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run db:push` | Create/update DB tables |
| `npm run db:seed` | Create admin user |

## Folder structure

```
web/
├── prisma/schema.prisma   # Database models
├── public/picture/        # Team photos
├── src/app/               # Pages & routes
├── src/app/actions/       # Server actions
├── src/components/        # UI components
├── src/lib/               # Auth, matcher, PDF extract
├── .env.example           # Env template (copy to .env)
└── VERCEL-DEPLOY.md       # Deploy guide
```

## Team photos

Place images in `public/picture/`:

- `gullzaman.jpg`
- `hasnain.jpg`
- `rizwan.jpg`
- `IMG-20240608-WA0037.jpg`

## License

FYP project — Smart Resume AI.
