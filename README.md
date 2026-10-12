# MediConnect — AI-Powered Digital Clinic Platform

MediConnect is a full-featured digital clinic web application designed to connect patients, healthcare professionals, and medical knowledge. The platform provides disease and medication information libraries, doctor discovery, real-time appointment booking, secure virtual video consultations, and an AI-driven health triage assistant built with strict medical safety guardrails.

---

## Current Status

- **Phase**: Phase 0 — Project Foundation & Documentation System
- **Status**: Completed (Documentation & Architecture Foundation)
- **Application Codebase**: Not yet initialized (Scheduled for Phase 1)
- **Next Phase**: Phase 1 — Application setup, database, authentication, and roles

---

## Main Features (Planned)

- **Doctor Discovery & Search**: Filter verified healthcare providers by specialty, consultation fee, rating, and real-time calendar availability.
- **Appointment Management**: Seamless booking with transactional concurrency locks to prevent double-booking, status tracking, and automated reminders.
- **Encrypted Online Video Consultations**: Browser-based peer-to-peer video rooms with in-call clinical note-taking and consultation summaries.
- **Medical Information Encyclopedia**: Curated, searchable libraries for diseases (symptoms, causes, prevention) and medicines (indications, contraindications, side effects).
- **AI Health Triage Assistant**: Pre-consultation conversational triage with strict medical disclaimers, red-flag emergency detection, and specialist recommendations.
- **Role-Based Access Control (RBAC)**: Secure patient, doctor, and administrator portals with audit logging for patient health information.

---

## Planned Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js (App Router, React 19, TypeScript) |
| **Styling** | Modern Vanilla CSS & Design Tokens (CSS Modules) |
| **Database & ORM** | PostgreSQL with Prisma ORM / Supabase |
| **Authentication** | NextAuth.js (Auth.js) / Secure HTTP-Only Cookie Sessions |
| **Telehealth / Realtime** | WebRTC + WebSocket signaling for peer video streams |
| **AI Integration** | Vercel AI SDK with OpenAI / Claude / Gemini API |
| **Validation** | Zod runtime schema validation |

---

## Project Documentation

Detailed architecture, database models, and tracking files are available in this repository:

- [`BRAIN.md`](./BRAIN.md) — Master architectural source of truth, core rules, and clinical safety standards.
- [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) — Real-time feature checklist, phase tracking, and bug log.
- [`CHANGELOG.md`](./CHANGELOG.md) — Chronological implementation session logs.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — Proposed system architecture, layer diagrams, and data flows.
- [`docs/DATABASE.md`](./docs/DATABASE.md) — Proposed database entities, relations, and data access rules.
- [`docs/API.md`](./docs/API.md) — Planned API modules, route endpoints, and request/response specifications.

---

## Setup and Execution Instructions

> **Note**: The application codebase has not been initialized yet (Phase 0 completed). Full setup commands and package manager instructions will be enabled during **Phase 1: Application Setup, Database, Authentication, and Roles**.

### Prerequisites (Planned)
- Node.js (v20+ LTS recommended)
- npm, pnpm, or yarn
- PostgreSQL database instance

### Installation *(Pending Phase 1)*
```bash
# Clone the repository
git clone https://github.com/Saadali114/Digital-Clinic.git

# Navigate into the project directory
cd Digital-Clinic

# Install dependencies (Available in Phase 1)
# npm install

# Configure environment variables (Available in Phase 1)
# cp .env.example .env.local

# Run database migrations (Available in Phase 1)
# npx prisma migrate dev

# Start development server (Available in Phase 1)
# npm run dev
```

---

## Safety & Medical Disclaimer

MediConnect and its AI Health Assistant are designed strictly for educational, informational, and triage assistance. The platform does not replace professional medical advice, clinical diagnosis, or emergency healthcare services. In the event of a medical emergency, users must contact their local emergency medical services immediately.
