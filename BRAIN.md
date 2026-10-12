# MediConnect — Project Brain & Architectural Source of Truth

> **Document Status**: Proposed Architecture & Master Source of Truth (Phase 0)  
> **Last Updated**: 2026-10-12  
> **Application Implementation State**: Uninitialized (Foundation & Documentation Phase)

---

## 1. Project Name and Vision

**Project Name**: MediConnect  
**Vision**: An intelligent, accessible, and secure digital clinic platform bridging the gap between healthcare seekers and medical professionals. MediConnect empowers patients to make informed decisions about their well-being by providing curated medical knowledge, clinical AI triage support, seamless specialist discovery, frictionless appointment scheduling, and encrypted virtual consultations.

---

## 2. Problem Statement and Project Objectives

### Problem Statement
Modern outpatient healthcare suffers from significant fragmentation:
- **Information Asymmetry**: Patients struggle to find verified, accessible information on diseases and medications, often relying on unvetted internet searches that induce health anxiety.
- **Access Barriers**: Booking consultations with qualified specialists frequently involves long wait times, manual telephone calls, and scheduling friction.
- **Geographic & Mobility Limitations**: Remote or mobility-impaired patients cannot easily access timely professional medical opinions.
- **Triage Delay**: Patients often do not know whether symptoms require immediate emergency care, a specialist visit, or basic at-home care.

### Project Objectives
1. Provide a centralized, authenticated platform for patients, doctors, and clinic administrators.
2. Facilitate reliable doctor discovery with verified credentials, specialties, ratings, and real-time calendar availability.
3. Offer end-to-end appointment management with automated status workflows and real-time notifications.
4. Enable secure, browser-based online video consultations without third-party software installation.
5. Provide a curated medical encyclopedia for diseases, treatments, and drug references.
6. Deliver a responsible, safety-first AI Health Assistant for pre-consultation triage and health literacy, designed strictly with medical disclaimers and emergency detection.
7. Safeguard sensitive personal health information (PHI) through stringent role-based access control, encryption, and auditability.

---

## 3. Target Users

| Role | Primary Objectives | Key Workflows |
|---|---|---|
| **Patient** | Find qualified care, understand health conditions, book visits, attend video calls | Search doctors by specialty/location, book & reschedule slots, chat with AI triage assistant, browse medical library, join encrypted video consultations, view consultation summaries |
| **Doctor** | Manage clinical schedule, conduct consultations, review patient medical notes | Configure recurring availability & exception slots, review patient intake forms, launch video consultation rooms, write post-consultation notes & recommendations |
| **Administrator** | Ensure platform safety, verify credentials, oversee clinical operations | Review and verify doctor medical licenses, manage user statuses, monitor audit logs, manage disease and medicine content catalogs |
| **Super Admin** | System integrity, role elevation, platform compliance | Manage administrative permissions, inspect system health, enforce security policies |

---

## 4. Core Features and Future Enhancements

### Core Features (Phases 0–7)
- **Identity & RBAC**: Multi-role authentication (Patient, Doctor, Admin) with granular permission guards.
- **Doctor Directory & Search**: Dynamic filtering by specialty, condition, language, consultation fee, and rating.
- **Interactive Scheduling**: Real-time calendar slot reservation with conflict detection, timezone conversion, and booking statuses.
- **Encrypted Virtual Consultations**: WebRTC-based video/audio rooms with in-call text messaging and connection state monitoring.
- **Medical Information Hub**: Peer-reviewed disease database (symptoms, causes, risk factors) and medicine directory (indications, dosages, contraindications, side effects).
- **AI Health Assistant**: Context-aware clinical chatbot offering symptom triage, specialist recommendation, and educational information backed by safety guardrails.
- **Administrative Portal**: Doctor onboarding/credential verification workflow, platform metrics, and content management.

### Future Enhancements (Post-Phase 8 Roadmap)
- Electronic prescription (e-Rx) generation with pharmacy fulfillment APIs.
- Wearable / IoT health vitals data synchronization (Apple HealthKit, Google Health Connect).
- Automated lab report OCR analysis with patient-friendly metric explanations.
- Multi-party video consultations (patient + caregiver/translator + doctor).
- Integrated multi-currency payment gateway for consultation fee escrow.
- Multi-lingual localization (i18n) for international patient accessibility.

---

## 5. Technology Stack and Architecture Justification

*(Note: Proposed stack for full application implementation starting in Phase 1)*

| Layer | Chosen Technology | Justification |
|---|---|---|
| **Framework / Runtime** | **Next.js (App Router, React 19, TypeScript)** | Full-stack server and client capabilities, React Server Components for SEO-critical doctor profiles and medical libraries, unified API route handlers, strong typing across client and server. |
| **Styling & UI Design** | **Modern Vanilla CSS / Design Tokens (CSS Modules)** | Maximum layout flexibility, zero external CSS runtime overhead, adherence to custom design tokens (typography, colors, elevation) without third-party framework lock-in. |
| **Database** | **PostgreSQL (via Prisma ORM / Supabase)** | Relational data integrity is non-negotiable for medical scheduling, user permissions, relational foreign keys (Doctor <-> Slots <-> Appointments), and transactional booking locks. |
| **Authentication** | **NextAuth.js (Auth.js) / Supabase Auth** | Standardized session management, JWT/Database sessions, bcrypt/Argon2 password hashing, secure HTTP-only cookies, role-based middleware guards. |
| **Video / Realtime** | **WebRTC + WebSockets (Daily.co or Socket.io signaling)** | Sub-second peer-to-peer latency, browser native compatibility, end-to-end media encryption suitable for telehealth compliance. |
| **AI Assistant** | **Vercel AI SDK + OpenAI GPT-4o / Anthropic Claude / Gemini API** | Streaming conversational responses, deterministic system prompt guardrails, structured JSON outputs for symptom categorization. |
| **Validation** | **Zod** | End-to-end runtime type safety across API boundaries, forms, and environment variables. |

---

## 6. Proposed Application Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         Presentation Layer                               │
│  Patient Portal  │  Doctor Workspace  │  Admin Console  │  Public Hub    │
│  (Next.js App Router, React Server Components, Responsive Client UI)     │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │ HTTPS / WSS
┌────────────────────────────────────▼─────────────────────────────────────┐
│                      Application & Security Layer                        │
│  - Middleware: Authentication & Role-Based Access Control (RBAC)         │
│  - API Route Handlers (/api/auth, /api/appointments, /api/ai, etc.)      │
│  - Zod Request Validation & Sanitization                                 │
│  - Rate Limiting & Sensitive Data Masking                                │
└──────────────────┬─────────────────┬─────────────────┬───────────────────┘
                   │                 │                 │
┌──────────────────▼──────┐ ┌────────▼───────┐ ┌───────▼───────────────────┐
│     Domain Services     │ │  AI Assistant  │ │    Realtime Service      │
│ - Appointment Manager   │ │ - Triage Logic │ │ - WebRTC Signaling       │
│ - Doctor Schedule Engine│ │ - Prompt Guard │ │ - Room State & Tokens    │
│ - Medical Library Query │ │ - Disclaimers  │ │ - Active Participant Mgmt│
└──────────────────┬──────┘ └────────┬───────┘ └───────┬───────────────────┘
                   │                 │                 │
┌──────────────────▼─────────────────▼─────────────────▼───────────────────┐
│                    Persistence & Infrastructure Layer                    │
│  - PostgreSQL (Prisma ORM): Relational DB with ACID transactions         │
│  - Audit Logs & Structured Telemetry                                     │
│  - External Provider APIs (Video Signaling, LLM Gateway, Mail/SMS)       │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Proposed Folder Structure

```
digital-clinic/
├── .git/
├── docs/                               # Architectural & specification documents
│   ├── ARCHITECTURE.md                 # System components & data flow
│   ├── DATABASE.md                     # Data models, schema & relations
│   └── API.md                          # API contract & endpoints
├── src/                                # Source code (To be initialized in Phase 1)
│   ├── app/                            # Next.js App Router pages & routes
│   │   ├── (auth)/                     # Auth routes (login, register, forgot-password)
│   │   ├── (patient)/                  # Patient dashboard, bookings, history
│   │   ├── (doctor)/                   # Doctor schedule, consultations, patient list
│   │   ├── (admin)/                    # Admin verification & management
│   │   ├── api/                        # REST & Streaming endpoints
│   │   ├── consultation/[id]/          # WebRTC video consultation room
│   │   ├── diseases/                   # Public disease encyclopedia
│   │   ├── medicines/                  # Public medicine library
│   │   ├── doctors/                    # Doctor directory & profile pages
│   │   ├── page.tsx                    # Landing page
│   │   └── layout.tsx                  # Global layout & metadata
│   ├── components/                     # Reusable UI components
│   │   ├── ui/                         # Buttons, inputs, modals, cards, badges
│   │   ├── layout/                     # Header, footer, sidebar, navigation
│   │   ├── consultations/              # Video controls, stream grids, chat
│   │   ├── ai-assistant/               # Chat drawer, disclaimer banner, message bubbles
│   │   └── doctors/                    # Filter cards, booking calendar, slot picker
│   ├── lib/                            # Shared utilities and singleton instances
│   │   ├── db.ts                       # Prisma client or database connection
│   │   ├── auth.ts                     # Authentication configuration & session helpers
│   │   ├── ai.ts                       # LLM client & prompt templates
│   │   ├── validations.ts              # Zod schemas
│   │   └── utils.ts                    # Formatters, date helpers, classnames
│   ├── styles/                         # Global styles & design system tokens
│   │   ├── tokens.css                  # Color palettes, typography, spacing, shadows
│   │   └── globals.css                 # Base CSS reset & standard utilities
│   └── types/                          # Shared TypeScript interfaces & types
├── .env.example                        # Template for environment configuration
├── BRAIN.md                            # Primary source of truth & architectural log
├── PROJECT_STATUS.md                   # Real-time feature checklist & progress tracker
├── CHANGELOG.md                        # Implementation log & session records
└── README.md                           # Project onboarding & setup instructions
```

---

## 8. Database Entities and Relationships (Proposed)

1. **User**: Authentication credential, email, password hash, role (`PATIENT`, `DOCTOR`, `ADMIN`, `SUPER_ADMIN`), status (`ACTIVE`, `PENDING_VERIFICATION`, `SUSPENDED`).
2. **PatientProfile**: Linked 1:1 to User; date of birth, gender, blood group, emergency contact, allergies, medical history summary.
3. **DoctorProfile**: Linked 1:1 to User; medical license number, verification status, biography, consultation fee, specialties, education, years of experience, clinic address, rating.
4. **Specialty**: Medical fields (e.g., Cardiology, Dermatology, Pediatrics, General Medicine). Linked M:N to DoctorProfile.
5. **AvailabilitySlot**: Recurring and date-specific availability intervals configured by Doctors.
6. **Appointment**: Connects Patient, Doctor, Slot, status (`REQUESTED`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `NO_SHOW`), consultation type (`VIDEO`, `IN_PERSON`), booking notes.
7. **ConsultationSession**: Tracks individual video sessions, room ID, start time, end time, doctor notes, diagnosis summary, follow-up date.
8. **Prescription**: Issued by Doctor during/after ConsultationSession; contains medications, dosages, frequency, duration, instructions.
9. **DiseaseArticle**: Medical encyclopedia entry; name, scientific name, symptoms, causes, risk factors, prevention, when to see a doctor, review status.
10. **MedicineArticle**: Medicine reference; generic name, brand names, drug class, indications, dosage guidance, contraindications, side effects, interactions.
11. **Notification**: User-specific alerts for appointment updates, reminders, verification status changes.
12. **AuditLog**: Immutable security log tracking PHI access, role alterations, login attempts, and record modifications.

---

## 9. Authentication and Role-Based Authorization Rules

### Role Definitions
- **PATIENT**: Can access personal profile, search doctors, book appointments, join own video calls, access medical libraries, chat with AI assistant.
- **DOCTOR**: Can access own schedule, accept/decline bookings, start scheduled video calls, enter clinical consultation notes, prescribe medication for treated patients. Cannot view other doctors' unassigned patient records.
- **ADMIN**: Can review doctor license credentials, approve or reject doctor profiles, manage encyclopedia content, view anonymized operational statistics. Cannot view confidential doctor-patient clinical consultation notes without audit flag.
- **SUPER_ADMIN**: Full system maintenance, role promotion, security policy enforcement.

### Enforcement Rules
1. **Server-Side Verification**: Role checks must occur in Next.js Server Components and API Route Handlers. Client-side navigation guards are for UX only.
2. **Session Integrity**: Use HTTP-only, Secure, SameSite cookies for session tokens.
3. **Horizontal Privilege Protection**: A patient cannot query `/api/appointments/:id` unless `appointment.patientId === session.user.id`. A doctor can only query if `appointment.doctorId === session.user.id`.

---

## 10. AI Health Assistant Behavior and Medical Safety Requirements

### Non-Negotiable Medical Safety Guardrails
1. **Never Make Definitive Diagnoses**: The AI must consistently clarify that it provides health education and triage suggestions, not certified medical diagnoses.
2. **Never Prescribe or Modify Medication**: The AI must not instruct patients on specific prescription dosages or recommend stopping prescribed medications.
3. **Mandatory Persistent Disclaimer**: Every chat session and consultation response must include:
   > *"MediConnect AI Assistant is for informational and triage purposes only. It does not replace professional medical judgment. In emergencies, call your local emergency number immediately."*
4. **Emergency Red-Flag Detection**: If user prompt exhibits indicators of life-threatening emergencies (e.g., severe acute chest pain, sudden facial drooping/slurred speech, uncontrolled bleeding, suicidal ideation, anaphylaxis), the AI must immediately:
   - Halt standard triage.
   - Display a high-visibility Emergency Alert banner.
   - Instruct the user to dial emergency services (e.g., 911 / 112 / 999) or proceed to the nearest emergency department.
5. **No Private PHI Storage in LLM Gateway**: User chat sessions sent to external LLMs must not transmit raw identifiers (national IDs, phone numbers, full names).

---

## 11. Appointment and Video Consultation Workflows

### Appointment Booking Workflow
```
[Patient searches Doctors] ──► [Selects verified Doctor & Date] 
                       ──► [Chooses Available Slot]
                       ──► [Submits Intake Reason]
                       ──► [Appointment Created: 'CONFIRMED' / 'REQUESTED']
                       ──► [Email / System Notification sent to Doctor & Patient]
```

### Video Consultation Workflow
```
[15 min prior: Reminder Notification & Room Unlock]
                       ──► [Patient & Doctor Enter Consultation Waiting Room]
                       ──► [Device Permission Check: Camera & Mic tested]
                       ──► [Doctor admits or joins room -> Session 'IN_PROGRESS']
                       ──► [Encrypted WebRTC Peer Stream established]
                       ──► [Doctor completes Consultation Notes]
                       ──► [Call Ends -> Status 'COMPLETED' -> Summary saved]
```

---

## 12. Security, Privacy, and Health-Data Handling Requirements

1. **HIPAA & GDPR Principles**: Data minimization, purpose limitation, integrity, and confidentiality.
2. **Encryption in Transit & at Rest**: TLS 1.3 for all HTTP and WebSocket connections. AES-256 for persistent database storage and backups.
3. **Audit Logging**: Every access to patient clinical summaries, prescriptions, or notes must record `userId`, `action`, `resourceId`, `timestamp`, and `ipAddress` into an append-only `AuditLog` table.
4. **No Secrets in Code**: Zero tolerance for hardcoded tokens, passwords, or API keys. All credentials reside in `.env.local` (untracked by git) with a documented `.env.example`.
5. **Data Sanitization**: All patient inputs must be sanitized against XSS and validated using strict Zod schemas.

---

## 13. Coding Conventions and Reusable Component Principles

1. **Strict TypeScript**: No implicit `any`. All API contracts, database outputs, and component props must have explicit interfaces.
2. **Component Modularity**: UI components must follow single-responsibility design. Pure presentation components separated from data-fetching server components.
3. **Aesthetic Excellence & Vanilla CSS**: Follow modern design principles:
   - Deep, cohesive color palette with semantic CSS variables (`--color-primary`, `--color-surface`, etc.).
   - Modern typography hierarchy with clean font stacks.
   - Subtle glassmorphism, micro-transitions, and responsive layouts.
   - Avoid unconfigured, bloated CSS frameworks unless explicitly mandated.
4. **Accessible Elements**: Semantic HTML (`<main>`, `<nav>`, `<article>`, `<button>`), descriptive `aria-` attributes, and keyboard navigability (WCAG 2.1 AA target).

---

## 14. Environment Variable and External Service Requirements

Planned configuration keys to be documented in `.env.example`:
- `DATABASE_URL`: Connection string for PostgreSQL database.
- `NEXTAUTH_SECRET`: Symmetric key for signing authentication tokens.
- `NEXTAUTH_URL`: Canonical root URL of the deployment.
- `AI_PROVIDER_API_KEY`: API key for AI assistant backend (OpenAI / Claude / Gemini).
- `WEBRTC_SIGNALING_SERVER` or `DAILY_API_KEY`: Credentials for video room management.
- `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_FROM`: Notification dispatch service.

---

## 15. Development Phases and Dependencies

```
Phase 0: Project Foundation & Documentation System (CURRENT)
    │
    ▼
Phase 1: Application Setup, Database, Authentication, and Roles
    │
    ├─────────────────────────────────────────┐
    ▼                                         ▼
Phase 2: Public Website, Doctor Search,     Phase 5: Disease & Medicine
Profiles, and Dashboards                             Libraries
    │                                         │
    ▼                                         │
Phase 3: Appointment Scheduling &             │
Notifications                                 │
    │                                         │
    ▼                                         │
Phase 4: Online Video Consultations           │
    │                                         │
    └────────────────────┬────────────────────┘
                         ▼
Phase 6: AI Health Assistant (Triage & Safety Engine)
                         │
                         ▼
Phase 7: Admin Tools, Security & Audit Logging
                         │
                         ▼
Phase 8: Testing, Deployment & Final Documentation
```

---

## 16. Important Technical Decisions and Rationale

| Decision | Rationale |
|---|---|
| **Documentation-First (Phase 0)** | Prevents architectural drift, establishes clear boundaries between proposed and implemented code, and guarantees auditability. |
| **Relational Database over NoSQL** | Medical records, doctor availability slots, and appointment states require ACID transactions and strict relational foreign key constraints to prevent double-booking. |
| **Server-Side Role Guarding** | In healthcare applications, client-side route hiding is insufficient; every server endpoint must independently verify user authorization. |
| **WebRTC Native Peer-to-Peer** | Provides zero intermediate recording by default, safeguarding patient consultation privacy while offering ultra-low latency. |

---

## 17. Known Limitations and Unresolved Decisions

- **Video Architecture**: Decision pending between a managed WebRTC provider (e.g., Daily.co / LiveKit) versus a custom self-hosted WebSockets signaling server.
- **Payment Processing**: Payment integration is deferred to post-Phase 8 to focus on core clinical and scheduling workflows.
- **Medical Content Sourcing**: Disease and medicine datasets will initially be seeded with verified medical editorial samples; external clinical API integration (e.g., RxNorm, ICD-10) is slated for future phases.

---

## 18. Permanent Working Rules

1. Before starting any new phase, read `BRAIN.md`, `PROJECT_STATUS.md`, and the relevant sections of `CHANGELOG.md`.
2. Implement only the phase explicitly requested by the user.
3. Do not silently skip requirements or implement unrelated features.
4. After implementation, run the relevant available checks and inspect the results.
5. Update `PROJECT_STATUS.md` using verified results.
6. Append an entry to `CHANGELOG.md` for each implementation session.
7. Update `BRAIN.md` if an architectural decision or project requirement changes.
8. Never mark incomplete or untested functionality as complete.
9. Record blockers, failed tests, missing credentials, and external integration requirements honestly.
10. At the end of each phase, provide a concise report containing completed work, files changed, test results, outstanding issues, and the next recommended phase.
11. Never expose API keys, passwords, access tokens, or private patient information in documentation or logs.
12. Do not store unnecessary sensitive patient data in test fixtures.
