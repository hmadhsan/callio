# Callio Beta Signup Landing Page

A focused, production-ready early-access beta signup page optimized for collecting user registrations and storing them in a database.

## 🎯 Purpose

This is a refactored version of the Callio landing page, stripped down to focus on beta signups. It eliminates marketing fluff and keeps the technical story sharp while providing a seamless signup experience.

## ✨ Features

### Frontend
- **Dark mode** professional design
- **Clean beta signup form** with email, role selection, and optional company field
- **Form validation** with real-time error handling
- **Success state** with visual confirmation
- **Responsive design** optimized for all devices

### Backend
- **API Route** `/api/beta-signup` - handles form submissions
- **Database integration** with Prisma and SQLite
- **Email validation** - regex validation for proper email format
- **Duplicate prevention** - prevents same email from signing up twice
- **Role-based tracking** - tracks what type of user is signing up (Developer, API Provider, AI Startup, Other)
- **Timestamp recording** - logs when each signup occurred

## 🗂️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── beta-signup/
│   │       └── route.ts           # API endpoint for form submissions
│   ├── page.tsx                   # Beta signup landing page
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
prisma/
├── schema.prisma                  # Database schema
├── migrations/                    # Database migrations
└── dev.db                        # SQLite database file
.env                             # Environment variables
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up database** (already done, but for reference)
   ```bash
   npx prisma migrate dev
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **View the page**
   Visit `http://localhost:3000` in your browser

## 📝 Signup Form

### Fields
- **Email Address*** (required)
  - Email input with validation
  - Prevents duplicate signups
  
- **Role** (required)
  - Dropdown selector
  - Options: Developer, API Provider, AI Startup, Other
  - Helps segment users for messaging

- **Company** (optional)
  - Free text field
  - Nullable in database

### Validation
- Email format validated using regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Role must be one of: Developer, API Provider, AI Startup, Other
- Duplicate emails rejected with 409 Conflict response
- All errors displayed to user with clear messaging

### Success Flow
1. Form submitted to `/api/beta-signup`
2. Validation performed server-side
3. Data stored in database
4. Success message displayed: "You're on the list. We'll be in touch soon."
5. Form resets
6. Success message auto-hides after 5 seconds

## 🗄️ Database Schema

### BetaSignup Model
```prisma
model BetaSignup {
  id        String   @id @default(cuid())     // Unique identifier
  email     String   @unique                   // Email address (unique)
  role      String                            // User role/type
  company   String?                           // Optional company name
  createdAt DateTime @default(now())          // Signup timestamp
  updatedAt DateTime @updatedAt               // Last update timestamp

  @@index([email])
  @@index([createdAt])
}
```

### Database File
- SQLite database stored at `./dev.db`
- Automatically created on first migration
- Indexes on email and createdAt for fast queries

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
  "id": "clnxyz..."
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields or invalid role
- `409 Conflict` - Email already registered
- `500 Internal Server Error` - Database error

## 📊 Page Sections

### 1. Hero Section
- Headline: "APIs, Built for Agents"
- Subheadline explaining the value prop
- Two CTAs: "Request Early Access" and "Join the Private Beta"

### 2. The Problem (4 bullet points)
- Agents rely on dozens of APIs
- APIs aren't designed for AI workflows
- Manual integration slows down development
- Authentication and routing are messy

### 3. What Callio Does (5 feature cards)
- Converts OpenAPI specs into LLM-ready tool schemas
- Makes tools searchable for agents
- Handles secure API key storage
- Provides execution proxy endpoints
- Normalizes API responses for AI use

### 4. How It Works (3-step process)
- Upload API spec
- Callio processes it
- Agents execute automatically

### 5. Join the Beta (Main signup form)
- Email input
- Role selector
- Company field (optional)
- Submit button
- Success state

### 6. Social Proof Section
- "Currently onboarding early API providers and AI builders"

### 7. Footer
- Links to Contact and Privacy Policy
- Social media (Twitter, GitHub)

## 🛠️ Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Database**: SQLite with Prisma ORM
- **Validation**: Built-in form validation + server-side validation
- **State Management**: React hooks (useState)

## 📦 Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Database for Production
Currently uses SQLite for development. For production, consider:
- **PostgreSQL** - Recommended for scalability
- **MySQL** - Good alternative
- **MongoDB** - If using Prisma's MongoDB adapter

To switch databases:
1. Update `prisma/schema.prisma` datasource
2. Update `.env` DATABASE_URL
3. Run `npx prisma generate` and `npx prisma migrate deploy`

### Environment Variables
```env
DATABASE_URL="file:./dev.db"  # For development
# For production, use:
# DATABASE_URL="postgresql://user:password@host:port/dbname"
```

### Deployment Options
- **Vercel** (recommended for Next.js)
  - Push to GitHub
  - Connect repo to Vercel
  - Auto-deploys on push
  - Database: Use Vercel Postgres or external database

- **Docker**
  ```dockerfile
  FROM node:18-alpine
  WORKDIR /app
  COPY . .
  RUN npm ci && npm run build
  EXPOSE 3000
  CMD ["npm", "start"]
  ```

- **Traditional VPS**
  - Build locally or on server
  - Use PM2 or systemd for process management
  - Use nginx as reverse proxy

## 📋 Forms & Submission

The form automatically:
1. Validates email format
2. Checks for duplicate emails
3. Validates role selection
4. Shows loading state during submission
5. Displays success/error messages
6. Clears form on success
7. Auto-dismisses success message after 5 seconds

## 🔐 Security Considerations

- ✅ Server-side validation (never trust client input)
- ✅ Email validation both client and server
- ✅ Duplicate email prevention
- ✅ No sensitive data stored in frontend state
- ✅ CORS handled by Next.js
- ⚠️ Consider rate limiting for production
- ⚠️ Consider adding CAPTCHA to prevent spam
- ⚠️ Ensure .env files are in .gitignore

## 📬 Querying Signups

### Using Prisma CLI
```bash
npx prisma studio  # Visual database explorer
```

### Querying via API (example)
Create a new API route to expose signups (for your dashboard):
```typescript
// src/app/api/beta-signups/route.ts
export async function GET() {
  const signups = await prisma.betaSignup.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return Response.json(signups);
}
```

## 🎓 Common Tasks

### Export signups as CSV
```bash
npx prisma db execute --stdin < export.sql
```

### Delete a signup
In Prisma Studio or via API:
```typescript
await prisma.betaSignup.delete({
  where: { email: "user@example.com" }
});
```

### Find signups by role
```typescript
const developers = await prisma.betaSignup.findMany({
  where: { role: "Developer" }
});
```

### Find signups from last 7 days
```typescript
const recentSignups = await prisma.betaSignup.findMany({
  where: {
    createdAt: {
      gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  }
});
```

## 🐛 Troubleshooting

### "Database is locked" error
- SQLite has concurrency limitations
- Multiple processes accessing database simultaneously
- Solution: Use PostgreSQL for production

### Form not submitting
- Check browser console for errors
- Verify API route is accessible at `/api/beta-signup`
- Check `.env` DATABASE_URL is set correctly
- Verify database migration completed successfully

### Prisma client errors
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database (development only)
npx prisma migrate reset
```

## 📞 Support

For questions about:
- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)
- **Prisma**: [Prisma Documentation](https://www.prisma.io/docs/)
- **Tailwind**: [Tailwind CSS Docs](https://tailwindcss.com/docs)
- **SQLite**: [SQLite Documentation](https://www.sqlite.org/docs.html)

## 📄 License

This project is part of Callio. All content and design are proprietary.

---

**Last Updated**: February 17, 2026
