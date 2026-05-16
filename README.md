# Callio - AI API Marketplace Landing Page

A modern, premium SaaS landing page for Callio, an API marketplace designed specifically for AI agents.

## Overview

Callio enables developers to convert any API into an AI-discoverable, agent-usable tool in minutes. This landing page showcases the platform's value proposition with a clean, developer-focused design.

## MCP / Cursor Marketplace

The Callio MCP server is packaged separately under `mcp-server/` and submitted through Cursor's official marketplace flow. The repository root also includes the Cursor plugin manifest used for that submission.

## ✨ Features

### Sections

- **Navigation Bar** - Sticky navigation with logo, links, and CTA button
- **Hero Section** - Eye-catching headline with gradient text, subheadline, dual CTAs, and API schema preview
- **Problem Section** - Three key problems agents face with current APIs
- **Solution Section** - How Callio solves these problems with three core capabilities
- **How It Works** - Three-step process from upload to live agents
- **Developer Section** - Technical API examples and code previews
- **Pricing** - Free, Pro, and Enterprise tiers
- **CTA Section** - Final call-to-action before footer
- **Footer** - Links, social media, and company info

### Design

- **Dark Mode** - Premium black background with blue/cyan accents
- **Responsive** - Mobile-first design with breakpoints for all devices
- **Tailwind CSS** - Modern utility-first styling
- **Lucide Icons** - Clean, professional icon library
- **Premium Feel** - Inspired by Stripe and Vercel's design approach
- **Developer Aesthetic** - Code examples, technical copy, and CLI references

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the landing page.

### Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Main landing page component
│   └── globals.css     # Global styles
```

## 🎨 Customization

### Colors

The page uses a custom color scheme built on Tailwind's blue and cyan palettes:
- Primary: `blue-600`
- Accent: `cyan-400`
- Background: `black` with `gray-900` / `gray-950` layers

### Typography

- Headings: Bold, large tracking
- Body: Gray-400 text on black
- Code: Monospace font with color-coded syntax

### Content

Edit the JSX in `src/app/page.tsx` to customize:
- Headlines and subheadings
- Feature descriptions
- Pricing tiers
- Links and CTAs
- API examples

## 🔧 Technologies

- **Next.js 16** - React framework with server components
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS
- **Lucide React** - Icon library

## 📱 Responsive Breakpoints

- Mobile: `<640px`
- Tablet: `640px - 1024px`
- Desktop: `1024px+`

## 🎯 Key Sections Explained

### Hero Section
Creates immediate visual impact with:
- Large gradient headline ("Make Your API Agent-Ready in Minutes")
- Descriptive subheadline about capabilities
- Dual call-to-action buttons (Get Early Access, List Your API)
- Live API schema preview code block

### Problem Section
Uses grid layout with icon cards highlighting:
- Fragmented integrations (no standard way for agents)
- Auth & security overhead (time-consuming setup)
- Slow deployment (manual integration delays)

### Solution Section
Shows how Callio solves each problem with:
- Numbered steps UI (1, 2, 3)
- Auto-Generated Schemas capability
- Global Discovery marketplace
- Built-In Security & Routing
- Terminal visualization of upload process

### How It Works
Simple 3-step process with:
- Upload Your API (provide OpenAPI spec)
- Callio Generates Schema (AI-ready conversion)
- Agents Discover & Execute (live in agent network)

### Developer Section
Demonstrates technical value with:
- Real API endpoint examples (POST /api/search-tools)
- Tool search response format with JSON
- Generated JSON schema samples
- Link to full documentation

### Pricing
Three-tier model with:
- **Free**: $0/month, 1 API listing, 10K calls
- **Pro**: $99/month (most popular), unlimited APIs, 100K calls
- **Enterprise**: Custom pricing, unlimited everything

## 📝 Content Strategy

All copy is written to appeal to:
- **API providers** - developers who want to make their APIs discoverable
- **Technical teams** - developers building with AI agents
- **Enterprise decision-makers** - looking for scalable integration solutions

Messaging focuses on:
- Speed and simplicity (minutes, not days)
- AI-first approach (agents as first-class citizens)
- Developer experience (code samples, technical details)
- Trust and security (built-in auth and routing)

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub, then connect to Vercel for one-click deployment
```

### Other Platforms
```bash
npm run build
# Deploy the `.next` folder to your hosting provider
```

Supports:
- Vercel (one-click from GitHub)
- Netlify
- AWS Amplify
- Docker/Container deployment
- Any Node.js hosting

## 🎯 Performance

- Server-side rendering with Next.js
- Optimized images and assets
- CSS-in-JS with Tailwind (minimal bundle)
- Mobile-optimized responsive design
- ~45KB gzipped HTML with full interactivity

## 📄 License

This project is part of the Callio brand. All content and design are proprietary.

## 🤝 Customization Guide

### Editing the Landing Page

1. **Content Changes**: Edit `src/app/page.tsx`
   - Change headlines in `<h1>`, `<h2>` tags
   - Modify descriptions in `<p>` tags
   - Update links and CTA buttons

2. **Styling Changes**: Use Tailwind classes
   - Modify `className` attributes
   - Reference [Tailwind Docs](https://tailwindcss.com/docs)
   - Dark mode colors: `gray-900`, `blue-600`, etc.

3. **Adding New Sections**: 
   - Copy an existing `<section>` block
   - Update content and styling
   - The page is client-side, so changes are instant

4. **Preview Changes**: 
   ```bash
   npm run dev
   # Changes auto-reload in browser
   ```

## 📞 Support

For questions about:
- **Landing page design**: Refer to this README
- **Next.js setup**: [Next.js Documentation](https://nextjs.org/docs)
- **Tailwind CSS**: [Tailwind Documentation](https://tailwindcss.com/docs)
- **Icons**: [Lucide Icons](https://lucide.dev)
