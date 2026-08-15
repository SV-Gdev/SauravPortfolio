<div align="center">

# 🎮 Saurav Sharma — Game Developer Portfolio

<img src="public/hero-preview.png" alt="Portfolio Preview" width="100%" style="border-radius: 12px; max-width: 800px;" />

[![Deploy Status](https://api.netlify.com/api/v1/badges/YOUR_BADGE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_SITE_NAME/deploys)
[![CI/CD Pipeline](https://github.com/YOUR_USERNAME/saurav-portfolio/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/YOUR_USERNAME/saurav-portfolio/actions/workflows/ci-cd.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Aspiring game developer with 1.5+ years in Unity and 7 months in Unreal Engine.**  
Building immersive experiences through interactable UI, intelligent AI, and polished gameplay systems.

[🌐 Live Portfolio](https://YOUR_SITE.netlify.app) · [📧 Contact Me](mailto:your@email.com) · [💼 LinkedIn](https://linkedin.com/in/yourprofile)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎮 **Game Projects Showcase** | Filterable gallery of Unity & Unreal Engine projects with live demos |
| 🎬 **Video Showcase** | Gameplay video gallery with Google Drive integration & MP4 upload |
| 🔒 **Admin Panel** | Password-protected admin modal for managing portfolio content |
| 📱 **Fully Responsive** | Optimized for mobile, tablet, and desktop |
| 🌙 **Dark Mode** | Cinematic dark aesthetic with neon accent animations |
| ⚡ **Blazing Fast** | Next.js 16 + standalone output for optimal performance |
| 🤖 **Smooth Animations** | Framer Motion-powered transitions and micro-interactions |

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16, React 19, TypeScript 5.9 |
| **Styling** | Tailwind CSS 4, Framer Motion, Radix UI |
| **Database** | Prisma ORM, SQLite (local) |
| **State** | Zustand, TanStack Query |
| **Auth** | NextAuth.js |
| **UI Components** | shadcn/ui, Lucide Icons, cmdk |
| **Deployment** | Netlify (via `@netlify/plugin-nextjs`) |
| **CI/CD** | GitHub Actions |

</div>

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 20.x`
- **npm** `>= 9.x` (or [Bun](https://bun.sh/))
- A **SQLite** compatible environment (local dev)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/saurav-portfolio.git
cd saurav-portfolio
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
# or with Bun
bun install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Admin Panel (set a strong password)
ADMIN_PASSWORD="your-super-secret-admin-password"

# Google Drive Integration (optional)
NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID="your-google-drive-folder-id"
```

### 4. Initialize the database

```bash
npx prisma generate
npx prisma db push
```

### 5. Start the development server

```bash
npm run dev
```

> 🌐 Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Project Structure

```
saurav-portfolio/
├── 📁 .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions CI/CD pipeline
├── 📁 prisma/
│   └── schema.prisma          # Database schema
├── 📁 public/                 # Static assets
├── 📁 src/
│   ├── 📁 app/
│   │   ├── api/               # Next.js API routes
│   │   ├── globals.css        # Global styles & design tokens
│   │   ├── layout.tsx         # Root layout with metadata
│   │   └── page.tsx           # Home page
│   ├── 📁 components/
│   │   ├── portfolio/         # Portfolio-specific components
│   │   │   ├── Hero.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── FeaturedProject.tsx
│   │   │   ├── VideoShowcaseSection.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   ├── AdminModal.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/                # shadcn/ui components
│   ├── 📁 hooks/              # Custom React hooks
│   ├── 📁 lib/                # Utility functions
│   └── 📁 data/               # Static data / content
├── netlify.toml               # Netlify deployment config
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

---

## 🌐 Deployment (Netlify)

This project is configured for **zero-config** Netlify deployment via the official `@netlify/plugin-nextjs` plugin, which handles SSR, API routes, and Netlify Functions automatically.

### Option A — Deploy via Netlify Dashboard (Recommended for first time)

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Select your repository
4. Netlify auto-detects the `netlify.toml` config — just click **Deploy**
5. Add your environment variables under **Site Settings → Environment Variables**:

```
DATABASE_URL
ADMIN_PASSWORD
NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID
```

### Option B — Deploy via GitHub Actions (Automated)

The included CI/CD pipeline automatically deploys to Netlify on every push to `main`.

Add these **GitHub Secrets** to your repository (`Settings → Secrets → Actions`):

| Secret | Description |
|---|---|
| `NETLIFY_AUTH_TOKEN` | Your Netlify personal access token |
| `NETLIFY_SITE_ID` | Your Netlify site ID |
| `DATABASE_URL` | Production database URL |
| `ADMIN_PASSWORD` | Admin panel password |
| `NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID` | Google Drive folder ID |

**Getting your Netlify credentials:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and get your auth token
netlify login
netlify status

# Get your Site ID from: netlify.toml or Dashboard → Site Settings → General
```

---

## 🔄 CI/CD Pipeline

The GitHub Actions pipeline runs on every **push** and **pull request**:

```
Push / PR to main
       │
       ▼
┌─────────────────┐
│  🔍 Lint &      │  → ESLint + TypeScript type check
│  Type Check     │
└────────┬────────┘
         │ ✅ Pass
         ▼
┌─────────────────┐
│  🏗️ Build       │  → next build + prisma generate
│  Verification   │
└────────┬────────┘
         │ ✅ Pass (main branch only)
         ▼
┌─────────────────┐
│  🚀 Deploy to   │  → netlify deploy --prod
│  Netlify        │
└─────────────────┘
```

---

## 📝 Available Scripts

```bash
npm run dev          # Start development server on port 3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database commands
npm run db:push      # Push schema to database (dev)
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:reset     # Reset database (⚠️ deletes all data)
```

---

## 🎯 Portfolio Sections

| Section | Description |
|---|---|
| 🏠 **Hero** | Introduction with animated tech stack badges |
| ⭐ **Featured Project** | Highlighted best work with video/screenshots |
| 🎬 **Video Showcase** | Gameplay videos (MP4 upload + Google Drive) |
| 📂 **Projects** | All projects with filter by engine/category |
| 🔬 **Research** | Technical articles and dev-log posts |
| 👤 **About** | Bio, skills, and experience timeline |
| 📬 **Contact** | Contact form and social links |

---

## 🤝 Contributing

This is a personal portfolio — contributions are not expected.  
However, if you spot a bug or have a suggestion, feel free to open an issue!

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Designed & built by [Saurav Sharma](https://YOUR_SITE.netlify.app) 🎮**

*Unity · Unreal Engine · C# · C++ · 3D Modeling*

</div>
