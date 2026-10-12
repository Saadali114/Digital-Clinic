# MediConnect — System Architecture Blueprint

> **Document Status**: Finalized Architecture (Frontend & Dedicated Express Backend Separation)  
> **Last Updated**: 2026-10-12  
> **Phase**: Phase 1 — Application Setup, Database, Authentication & Roles

---

## 1. Architectural Overview & Monorepo Strategy

MediConnect uses a clean monorepo architecture within a single Git repository, dividing responsibilities strictly between a client-facing Next.js frontend and a dedicated Node.js Express backend.

```
+-----------------------------------------------------------------------------------+
|                           CLIENT TIER (Next.js App Router)                         |
|                               Port: 3000 (Default)                                |
|  - Presentation UI (Server & Client Components, Vanilla CSS Design Tokens)        |
|  - Route Guards & Client-side State Navigation                                    |
|  - Centralized API Client calling Backend via NEXT_PUBLIC_API_URL                 |
|  * Strictly NO direct database connection; NO backend business logic in Next.js * |
+-----------------------------------------+-----------------------------------------+
                                          | HTTPS / HTTP REST (/api/v1/*)
                                          | Credentials (Cookies) + JSON
+-----------------------------------------v-----------------------------------------+
|                        APPLICATION SERVER (Node.js + Express)                     |
|                               Port: 5000 (Default)                                |
|  +-----------------------------------------------------------------------------+  |
|  | Global Security Middleware: Helmet, CORS (Explicit Allowlist), Rate Limit  |  |
|  +-----------------------------------------------------------------------------+  |
|  +-----------------------------------------------------------------------------+  |
|  | Authentication & RBAC Middleware: Session Cookie Validation, Role Assertions|  |
|  +-----------------------------------------------------------------------------+  |
|  +-----------------------------------------------------------------------------+  |
|  | Request Validation: Zod Schemas across all incoming endpoints               |  |
|  +-----------------------------------------------------------------------------+  |
|  +--------------------------------+ +------------------------------------------+  |
|  | Core Controllers & Modules     | | Centralized Error Handler & Logger       |  |
|  | - Auth Module (/api/v1/auth)   | | - Domain errors (400, 401, 403, 404)     |  |
|  | - Health Check (/api/v1/health)| | - Database connection handling (503)     |  |
|  | - Users Module (/api/v1/users) | | - Unhandled exceptions (500)             |  |
|  +--------------------------------+ +------------------------------------------+  |
+-----------------------------------------+-----------------------------------------+
                                          | Prisma ORM (TCP Pool)
+-----------------------------------------v-----------------------------------------+
|                             PERSISTENCE TIER (PostgreSQL)                         |
|  - Port: 5432                                                                     |
|  - Managed exclusively by backend/prisma/schema.prisma                            |
|  - Models: User, PatientProfile, DoctorProfile, DoctorCredential                  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Repository Layout & Separation of Concerns

```
Digital-Clinic/
├── frontend/                     # Next.js App Router presentation tier
│   ├── src/
│   │   ├── app/                  # Next.js App Router pages (/login, /register, etc.)
│   │   ├── components/           # UI components, layout header/footer
│   │   ├── lib/                  # Centralized backend API client (apiClient.ts)
│   │   ├── styles/               # Vanilla CSS design tokens & global stylesheets
│   │   └── types/                # Frontend contracts & view model interfaces
│   ├── public/                   # Static assets
│   ├── package.json              # Frontend scripts & dependencies
│   └── .env.example              # NEXT_PUBLIC_API_URL template
├── backend/                      # Node.js + Express REST API tier
│   ├── src/
│   │   ├── config/               # Environment validation (Zod) & configuration
│   │   ├── middleware/           # Auth, RBAC, error handling, rate limiting
│   │   ├── modules/              # Feature modules (auth, users, health)
│   │   ├── routes/               # Express router mounting /api/v1/*
│   │   ├── services/             # Core business logic & database services
│   │   ├── utils/                # Password hashing, JWT signing, response helpers
│   │   ├── app.ts                # Express application configuration
│   │   └── server.ts             # Server bootstrap & port listener
│   ├── prisma/
│   │   └── schema.prisma         # PostgreSQL schema definition & migrations
│   ├── tests/                    # Backend unit & integration test suites
│   ├── package.json              # Backend scripts & dependencies
│   └── .env.example              # DATABASE_URL, PORT, CORS_ORIGIN, AUTH_SECRET
├── docs/                         # Architectural & specification documents
├── BRAIN.md                      # Primary project brain & source of truth
├── PROJECT_STATUS.md             # Quantitative progress tracker
├── CHANGELOG.md                  # Chronological implementation logs
├── README.md                     # Monorepo setup & development guide
├── .gitignore                    # Root ignore rules for node_modules, build & env
└── package.json                  # Root runner scripts (npm run dev, npm test)
```

---

## 3. Communication Patterns & Contracts

1. **API Protocol**: JSON over HTTP/HTTPS, versioned strictly under `/api/v1`.
2. **CORS Security**: Backend configures CORS with `origin: process.env.CORS_ORIGIN` (e.g., `http://localhost:3000`) and `credentials: true`. Wildcard origins (`*`) are prohibited when credentials are enabled.
3. **Session Management**: Express sets HTTP-only, SameSite cookies on authentication (`mediconnect_session`). The Next.js frontend forwards these credentials via `credentials: 'include'` on client fetches.
4. **Health Check Specification**: `GET /api/v1/health` verifies Express process health and attempts a lightweight database ping, returning separate statuses for `api` and `database`.
