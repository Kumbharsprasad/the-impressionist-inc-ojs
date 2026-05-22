Deployment notes — Vercel + Supabase

Overview
- This Next.js app uses Postgres via Drizzle and stores uploaded files in `public/uploads` by default.
- Vercel's filesystem is ephemeral; for production you must use external storage (Supabase Storage, S3, Firebase Storage, etc.).

Quick Vercel steps
1. Push your repo to GitHub.
2. Create a Vercel project and import the repo.
3. Set build & output settings (Vercel detects Next.js automatically). Use `npm run build`.
4. Add Environment Variables in Vercel (Project Settings > Environment Variables):
   - `DATABASE_URL` — your Postgres connection string (use a managed Postgres instance or Supabase Postgres URL)
   - `JWT_SECRET` — strong secret for JWT signing
   - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE` — if using Supabase Storage
5. Create the `uploads` bucket in Supabase Storage and set appropriate permissions (public or use signed URLs).
6. Run migrations against your production DB (see Drizzle below).

Drizzle migrations
- Locally you can run drift/kit commands. Example (replace with your chosen approach):

```
# generate a migration from your schema
npx drizzle-kit generate:migration --name init
# push migrations to the database
npx drizzle-kit push
```

If you use Supabase Postgres, set `DATABASE_URL` to the Supabase DB URL and run migration commands from your machine or CI.

Uploads
- The app now attempts to upload files to Supabase Storage (bucket `uploads`) if `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE` are set. Otherwise, it falls back to writing to `public/uploads` (not persistent on Vercel).
- Create the `uploads` bucket in Supabase and decide on public vs private access. For public files, create public access or use `getPublicUrl`. For private access, generate signed URLs.

Supabase migration path (recommended)
1. Create a Supabase project.
2. In Supabase > Settings > Database > Connection string, copy the `postgres` connection string.
3. Set that value as `DATABASE_URL` in your local `.env` and in Vercel env vars.
4. Run Drizzle migrations pointing to that DB.
5. Create a Storage bucket named `uploads`.
6. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE` to Vercel env vars.

Precautions
- Never commit `.env` with secrets.
- Use a strong `JWT_SECRET` and rotate keys if leaked.
- Monitor DB connection limits; use a pooler when needed.
- Ensure backups for your DB.

If you want, I can:
- create a script to migrate your current local DB to Supabase
- automatically replace local upload references with Supabase-only code
- or prepare Vercel environment var entries for you to paste
