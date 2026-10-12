# MediConnect — AI-Powered Digital Clinic Platform

MediConnect is an AI-powered digital clinic platform connecting patients, healthcare professionals, and verified medical libraries. The system is engineered using a monorepo architecture with an independent Next.js App Router frontend and a dedicated Node.js Express REST API backend.

---

## Current Status

- **Phase**: Phase 1 — Monorepo Setup, Frontend, Backend, Database, Authentication & Roles
- **Status**: Completed (Frontend & Express Backend Architecture Active)
- **Overall Completion**: **25.7%** (9 of 35 verified feature units completed)
- **Next Phase**: Phase 2 — Public Website, Doctor Search, Profiles, and Dashboards

---

## Monorepo Architecture Overview

MediConnect is structured as a single Git repository containing two separate, loosely coupled applications:

```
Digital-Clinic/
├── frontend/                     # Next.js App Router presentation tier (Port 3000)
│   ├── src/
│   │   ├── app/                  # App Router pages (/, /login, /register, etc.)
│   │   ├── components/           # UI components, layout header & footer
│   │   ├── lib/                  # Centralized Express API client (apiClient.ts)
│   │   ├── styles/               # Vanilla CSS design tokens & global stylesheets
│   │   └── types/                # Frontend view model interfaces
│   ├── package.json
│   └── .env.example              # NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
├── backend/                      # Node.js + Express REST API tier (Port 5000)
│   ├── src/
│   │   ├── config/               # Environment validation (Zod) & Prisma client
│   │   ├── middleware/           # Auth, RBAC, error handling, rate limiting
│   │   ├── modules/              # Health, auth, and users controllers/services
│   │   ├── routes/               # Express router mounting /api/v1/*
│   │   ├── utils/                # Password hashing (bcrypt) & JWT signing (jose)
│   │   ├── app.ts                # Express app configuration (Helmet, CORS, etc.)
│   │   └── server.ts             # HTTP server startup
│   ├── prisma/
│   │   └── schema.prisma         # PostgreSQL schema (User, Profiles, Credentials)
│   ├── tests/                    # Backend Vitest & Supertest integration tests
│   ├── package.json
│   └── .env.example              # PORT, CORS_ORIGIN, DATABASE_URL, AUTH_SECRET
├── docs/                         # System architecture, database & API specifications
├── BRAIN.md                      # Master architectural source of truth
├── PROJECT_STATUS.md             # Quantitative progress tracker
├── CHANGELOG.md                  # Chronological implementation session logs
├── README.md                     # Monorepo onboarding & developer guide
├── .gitignore                    # Root ignore rules
└── package.json                  # Root runner scripts
```

---

## Technology Stack

| Tier | Component | Technology & Version |
|---|---|---|
| **Frontend** | Framework | Next.js `15.5.27` (App Router) |
| **Frontend** | UI Library | React `19.0.0` |
| **Frontend** | Styling | Modern Vanilla CSS & Design Tokens (CSS3) |
| **Backend** | API Server | Node.js `24`, Express `4.21.2`, TypeScript `5.7.3` |
| **Backend** | Persistence | PostgreSQL via Prisma ORM `6.19.3` |
| **Backend** | Security | Helmet `8.0.0`, CORS (Explicit allowlist), Rate Limiter `7.5.0` |
| **Backend** | Authentication | Salted Bcrypt `2.4.3` (12 rounds) + Jose `5.9.6` HS256 JWT (HTTP-only cookies) |
| **Backend** | Validation | Zod `3.24.2` |
| **Testing** | Test Suite | Vitest `3.2.7` & Supertest `7.0.0` |

---

## Local Setup & Development Instructions

### Prerequisites
- Node.js (v20+ LTS or v24)
- npm (v10+)
- PostgreSQL database (local service or hosted instance like Supabase/Neon)

### 1. Installation
Clone the repository and install dependencies across the monorepo:
```bash
# Clone the repository
git clone https://github.com/Saadali114/Digital-Clinic.git
cd Digital-Clinic

# Install dependencies in backend and frontend
npm --prefix backend install
npm --prefix frontend install
```

### 2. Environment Configuration

**Backend (`backend/.env`):**
```bash
cp backend/.env.example backend/.env
```
Configure `backend/.env`:
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mediconnect_dev?schema=public
AUTH_SECRET=your_secure_random_secret_at_least_32_characters_long
```

**Frontend (`frontend/.env.local`):**
```bash
cp frontend/.env.example frontend/.env.local
```
Configure `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 3. Database Schema & Migration
Validate the schema and generate the Prisma Client:
```bash
# Validate schema
npm --prefix backend run prisma:validate

# Generate Prisma Client
npm --prefix backend run prisma:generate

# Run migrations (Requires live PostgreSQL instance)
npm --prefix backend run prisma:migrate
```

### 4. Running the Applications

**Run the Backend (Port 5000):**
```bash
npm run dev:backend
# API is accessible at: http://localhost:5000/api/v1
# Health check: http://localhost:5000/api/v1/health
```

**Run the Frontend (Port 3000):**
```bash
npm run dev:frontend
# Web app is accessible at: http://localhost:3000
```

### 5. Running Tests & Quality Checks
```bash
# Run backend test suite (Vitest + Supertest)
npm run test

# Run TypeScript checks across both applications
npm run typecheck

# Build both applications for production
npm run build:backend
npm run build:frontend
```

---

## Troubleshooting & Diagnostics

- **Database Connection Error (`Error: P1001`)**: If the PostgreSQL service is offline, the backend continues running in degraded health mode. Verify that your database is running on port 5432 or update `DATABASE_URL` in `backend/.env`.
- **CORS Errors**: Ensure `CORS_ORIGIN` in `backend/.env` matches the frontend URL (default: `http://localhost:3000`).
- **Missing Cookies**: Requests between frontend and backend must include `credentials: 'include'`. This is pre-configured in `frontend/src/lib/apiClient.ts`.

---

## Safety & Medical Disclaimer

MediConnect and its AI Health Assistant are designed strictly for educational, informational, and triage assistance. The platform does not replace professional medical advice, clinical diagnosis, or emergency healthcare services. In the event of a medical emergency, users must contact their local emergency medical services immediately.
