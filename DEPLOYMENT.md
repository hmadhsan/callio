# Callio - Production Deployment Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Supabase account for Postgres database
- Resend account for email (free tier works)

### Step 1: Prepare Your Code

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - Callio marketplace"
```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., "callio-marketplace")
   - Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/callio-marketplace.git
git branch -M main
git push -u origin main
```

### Step 2: Set Up Database (Supabase)

1. Go to https://supabase.com and create a new project
2. Get your connection string:
   - Go to Project Settings → Database
   - Copy the "Connection string" under "Connection Pooling"
   - It looks like: `postgresql://postgres.[ref]:[password]@[host]:5432/postgres`

3. **Push database schema**:
```bash
npx prisma db push
```

### Step 3: Deploy to Vercel

1. **Go to https://vercel.com** and sign in with GitHub

2. **Import your repository**:
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**:
   Add these in the Vercel deployment settings:

   ```
   DATABASE_URL=postgresql://postgres.[ref]:[password]@[host]:5432/postgres
   SESSION_SECRET=generate-a-random-32-char-string-here
   RESEND_API_KEY=re_your_resend_api_key
   RESEND_FROM_EMAIL=onboarding@resend.dev
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

   **Generate SESSION_SECRET**:
   Use this command to generate a secure random string:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

### Step 4: Set Up Resend Email

1. Go to https://resend.com/api-keys
2. Create a new API key
3. For testing: Use `onboarding@resend.dev` as sender
4. For production: 
   - Add your domain in Resend settings
   - Verify DNS records
   - Use `noreply@yourdomain.com`

### Step 5: Update App URL

After deployment, update the environment variable:
```
NEXT_PUBLIC_APP_URL=https://your-actual-domain.vercel.app
```

Redeploy or let Vercel auto-redeploy.

### Step 6: Seed the Database (Optional)

Run the seed script to populate example APIs:
```bash
node prisma/seed.js
```

Or manually create APIs through the provider dashboard.

---

## 📝 Post-Deployment Checklist

- [ ] Test sign-in with magic link
- [ ] Create provider account
- [ ] Add an API listing
- [ ] Generate API key
- [ ] Test proxy endpoint
- [ ] Verify email delivery
- [ ] Check all pages load correctly
- [ ] Set up custom domain (optional)

---

## 🔧 Troubleshooting

### Build fails with "Failed to collect page data"
- Ensure all API routes have `export const dynamic = 'force-dynamic'`
- Check that DATABASE_URL is set in Vercel

### Prisma errors
- Run `npx prisma generate` locally
- Ensure `postinstall` script runs `prisma generate`
- Check DATABASE_URL format is correct

### Email not sending
- Verify RESEND_API_KEY is correct
- Use `onboarding@resend.dev` for testing
- Check Resend dashboard logs

### Proxy returns 401
- Ensure API key is generated correctly
- Check Authorization header format: `Bearer callio_xxx`
- Verify API slug matches the URL

---

## 💰 Monetization Features

### Current Features (Production Ready)
✅ Magic link authentication
✅ API key generation with secure hashing
✅ Proxy layer for API forwarding
✅ Provider key storage (BYOK)
✅ Public/free API support
✅ Provider dashboard
✅ API marketplace listing

### To Add Later
- [ ] Stripe integration for payments
- [ ] Usage tracking per API key
- [ ] Rate limiting
- [ ] Analytics dashboard
- [ ] API key usage quotas
- [ ] Billing/invoicing

---

## 🌐 Custom Domain Setup

1. In Vercel project settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable
5. Redeploy

---

## 📊 Monitoring

- Check Vercel logs for errors
- Monitor Resend dashboard for email delivery
- Use Supabase dashboard to monitor database
- Set up Vercel Analytics (optional)

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Resend Docs: https://resend.com/docs
- Next.js Docs: https://nextjs.org/docs
