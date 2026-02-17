# Callio - Early Access Beta Signup 🚀

A production-ready early-access beta signup landing page for Callio, an AI API marketplace. Built with Next.js, Prisma, and SQLite. Optimized for collecting and managing user registrations.

## 🎯 Overview

This is a focused, technical beta signup page optimized for:
- Explaining Callio's value proposition clearly
- Collecting early adopter registrations
- Storing signups securely in a database
- Providing dark-mode developer aesthetic
- Handling validation, duplicates, and errors gracefully

## ✨ Key Features

### Page Sections
- **Navigation** - Callio logo + "Early Access Beta" badge
- **Hero** - "APIs, Built for Agents" with dual CTAs
- **Problem** - 4 sharp problem statements
- **What Callio Does** - 5 feature cards with descriptions
- **How It Works** - 3-step simple onboarding process
- **Beta Signup Form** - Email, role, company with full validation
- **Social Proof** - Currently onboarding message
- **Footer** - Contact, privacy, social links

### Backend Features
- ✅ **API Endpoint** `/api/beta-signup` - Handles form submissions
- ✅ **Database** SQLite with Prisma ORM for storing signups
- ✅ **Email Validation** Format check + duplicate prevention
- ✅ **Server-side Validation** Never trust client input
- ✅ **Error Handling** Clear, user-facing error messages
- ✅ **Success Flow** Visual confirmation with auto-dismiss (5s)
- ✅ **Role Tracking** Segment users by Developer/Provider/Startup/Other
- ✅ **Timestamp logging** Track when each signup occurred

### Design & UX
- **Dark Mode** - Professional developer aesthetic
- **Fully Responsive** - Mobile, tablet, desktop optimized
- **Tailwind CSS** - Modern utility-first styling
- **Lucide Icons** - Clean, professional iconography
- **Minimal** - Stripe/Vercel-level simplicity

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# 1. Install dependencies
npm install

# 2. Database is pre-configured (dev.db created automatically)

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000 in your browser
```

## 📋 Signup Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| **Email Address** | Email Input | ✓ | Format validation + unique check |
| **I am a...** | Select Dropdown | ✓ | Developer / API Provider / AI Startup / Other |
| **Company** | Text Input | ✗ | Optional, free text |

## 🔌 API Endpoint

### `POST /api/beta-signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "role": "Developer",
  "company": "Acme Corp"    // optional
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "You're on the list. We'll be in touch soon.",
  "id": "clnxyz1234..."
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields or invalid role
- `409 Conflict` - Email already registered
- `500 Internal Server Error` - Database or server error

## 🗄️ Database Schema

### BetaSignup Model
```prisma
model BetaSignup {
  id        String   @id @default(cuid())     // Unique ID
  email     String   @unique                   // Email (must be unique)
  role      String                            // User role/type
  company   String?                           // Optional company name
  createdAt DateTime @default(now())          // Signup time
  updatedAt DateTime @updatedAt               // Last updated

  @@index([email])      // Fast email lookups
  @@index([createdAt])  // Fast time-based queries
}
```

### Database Location
- **Development**: `./dev.db` (SQLite file)
- **Production**: Configure DATABASE_URL in `.env`

## 📊 View & Query Signups

```bash
# Open interactive Prisma Studio
npx prisma studio

# Then browse/query signups in the UI
```

Or use SQL directly with SQLite:
```sql
-- All signups by date
SELECT * FROM BetaSignup ORDER BY createdAt DESC;

-- Count by role
SELECT role, COUNT(*) as count FROM BetaSignup GROUP BY role;

-- Find recent signups (last 7 days)
SELECT * FROM BetaSignup WHERE createdAt > datetime('now', '-7 days');
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── beta-signup/
│   │       └── route.ts          # Form submission API endpoint
│   ├── page.tsx                  # Beta signup landing page
│   ├── layout.tsx                # Root layout + metadata
│   └── globals.css               # Global styles
prisma/
├── schema.prisma                 # Database schema definition
├── migrations/                   # Database migration history
│   └── 20260217141448_init/     # Initial schema migration
└── dev.db                       # SQLite database file (dev)
.env                             # Environment variables
.env.example                     # Environment template
BETA_SIGNUP_SETUP.md            # Detailed setup guide
```

## 🔧 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16 | React framework + server components |
| **React** | 19 | UI library |
| **TypeScript** | 5+ | Type safety |
| **Tailwind CSS** | 4 | Utility-first CSS |
| **Prisma** | 7 | TypeScript ORM |
| **SQLite** | Latest | Embedded database |
| **Lucide React** | Latest | Icon library |

## 💾 Database Setup

The project comes pre-configured with:
- ✅ Prisma schema in `prisma/schema.prisma`
- ✅ Migration in `prisma/migrations/20260217141448_init/`
- ✅ SQLite database `dev.db` created automatically
- ✅ Prisma client generated

**If you need to reset the database:**
```bash
npx prisma migrate reset  # ⚠️ WARNING: Deletes all data!
```

## 🚢 Production Deployment

### Step 1: Switch Database
For production, use PostgreSQL or MySQL instead of SQLite.

**Update `.env`:**
```env
# PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/callio_beta"

# Or MySQL
DATABASE_URL="mysql://user:password@host:3306/callio_beta"
```

### Step 2: Deploy Migration
```bash
npx prisma migrate deploy
```

### Step 3: Build & Deploy
```bash
npm run build
npm start
```

### Deployment Options

**Vercel (Recommended)**
```bash
# Push to GitHub, connect repo to Vercel
# Auto-deployment on push
# Database: Use Vercel Postgres or external DB
```

**Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Traditional VPS**
- Build: `npm run build`
- Process Manager: PM2 or systemd
- Reverse Proxy: nginx
- Database: PostgreSQL or MySQL

## 🔐 Security Best Practices

- ✅ Server-side validation (never trust client)
- ✅ Email format validation (regex)
- ✅ Duplicate email prevention (unique constraint)
- ✅ No sensitive data in frontend state
- ⚠️ Add CAPTCHA for spam prevention (production)
- ⚠️ Implement rate limiting on API endpoint
- ⚠️ Use HTTPS in production
- ⚠️ Keep `.env` in `.gitignore`
- ⚠️ Rotate database credentials regularly

## 📝 Customization

### Add a New Form Field

1. **Update Prisma schema** (`prisma/schema.prisma`):
   ```prisma
   model BetaSignup {
     // ... existing fields
     website String?  // New field
   }
   ```

2. **Create migration**:
   ```bash
   npx prisma migrate dev --name add_website_field
   ```

3. **Update form** (`src/app/page.tsx`):
   ```tsx
   const [website, setWebsite] = useState('');
   // Add input field and include in submission
   ```

4. **Update API** (`src/app/api/beta-signup/route.ts`):
   ```typescript
   const { email, role, company, website } = body;
   // Add validation if needed
   const signup = await prisma.betaSignup.create({
     data: { email, role, company, website }
   });
   ```

### Customize Form Validation

Edit `src/app/api/beta-signup/route.ts`:
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return NextResponse.json(
    { error: 'Invalid email address' },
    { status: 400 }
  );
}
```

### Change Form Labels/Copy

Edit `src/app/page.tsx` to customize field labels, placeholders, and button text.

## 📊 Example Queries

```typescript
// Get all signups
const all = await prisma.betaSignup.findMany();

// Get signups by role
const developers = await prisma.betaSignup.findMany({
  where: { role: 'Developer' }
});

// Get recent signups
const recent = await prisma.betaSignup.findMany({
  where: {
    createdAt: {
      gte: new Date(Date.now() - 24 * 60 * 60 * 1000)  // Last 24 hours
    }
  },
  orderBy: { createdAt: 'desc' }
});

// Find by email
const user = await prisma.betaSignup.findUnique({
  where: { email: 'user@example.com' }
});

// Delete a signup
await prisma.betaSignup.delete({
  where: { email: 'user@example.com' }
});
```

## 🐛 Troubleshooting

### "Error: Database is locked"
- SQLite has limited concurrent access
- Solution: Use PostgreSQL for production

### Form not submitting
```bash
# Check API route is reachable
curl -X POST http://localhost:3000/api/beta-signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","role":"Developer"}'
```

### Prisma errors
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database (dev only!)
npx prisma migrate reset

# View schema errors
npx prisma validate
```

### Database file permission errors
```bash
# Fix file permissions
chmod 644 dev.db
chmod 755 prisma/
```

## 📞 Resources

- **[BETA_SIGNUP_SETUP.md](BETA_SIGNUP_SETUP.md)** - Detailed setup guide
- **[Prisma Documentation](https://www.prisma.io/docs/)** - Database ORM
- **[Next.js Documentation](https://nextjs.org/docs)** - Framework docs
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Styling
- **[SQLite Docs](https://www.sqlite.org/docs.html)** - Database

## 📄 License

This project is part of Callio. All content and design are proprietary.

---

**Status**: ✅ Production Ready  
**Last Updated**: February 17, 2026  
**Next Steps**: Deploy to production, set up email notifications, configure analytics
