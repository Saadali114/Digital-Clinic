# MediConnect — Proposed System Architecture

> **Document Status**: Proposed Blueprint (Unverified until Phase 1+ Implementation)  
> **Last Updated**: 2026-10-12  
> **Phase**: Phase 0 — Foundation & Documentation

---

## 1. Architectural Overview

MediConnect is designed as a modular, full-stack web application adhering to clean architecture principles. It separates client-facing presentation, application routing, core business domain logic, and persistent storage into distinct layers.

```
+-------------------------------------------------------------------------+
|                           Client Browser                                |
|  - Patient Portal (Search, Book, Consult, AI Chat)                     |
|  - Doctor Workspace (Schedule, Consultations, Clinical Notes)          |
|  - Admin Dashboard (Verification, User & Catalog Management)            |
+------------------------------------+------------------------------------+
                                     | HTTPS / WebSockets
+------------------------------------v------------------------------------+
|                         Next.js App Server                              |
|  +-------------------------------------------------------------------+  |
|  | Middleware: Auth Session Validation & RBAC Guard                  |  |
|  +-------------------------------------------------------------------+  |
|  +--------------------------------+ +--------------------------------+  |
|  | Server Components (RSC)        | | Route Handlers (API / Streaming)|  |
|  | - SEO-driven Encyclopedia      | | - /api/auth, /api/appointments |  |
|  | - Doctor Public Profiles       | | - /api/ai/chat (Streaming)     |  |
|  | - Pre-rendered Dashboard Shells| | - /api/consultations/token     |  |
|  +--------------------------------+ +--------------------------------+  |
+------------------+----------------------------------+-------------------+
                   |                                  |
+------------------v------------------+ +-------------v-------------------+
|          Application Domain         | |      Realtime Signaling Hub     |
|  - Appointment Booking Engine       | |  - WebRTC Peer Connection       |
|  - Doctor Schedule Generator        | |  - Active Room State Tracking   |
|  - AI Guardrail & Triage Classifier | |  - In-call Ephemeral Messaging  |
+------------------+------------------+ +---------------------------------+
                   |
+------------------v------------------------------------------------------+
|                     Data & External Integration Layer                   |
|  +-------------------------------+  +--------------------------------+  |
|  | PostgreSQL (Prisma ORM)       |  | External Service Gateways      |  |
|  | - Users, Profiles, RBAC       |  | - LLM API (OpenAI/Claude/Gemini)  |
|  | - Appointments, Availability  |  | - Email/SMS Notification API   |  |
|  | - Encrypted Consultation Notes|  | - WebRTC Media/STUN/TURN       |  |
|  | - Immutable Audit Log Table   |  |                                |  |
|  +-------------------------------+  +--------------------------------+  |
+-------------------------------------------------------------------------+
```

---

## 2. Core Subsystems and Responsibilities

### 2.1 Identity and Access Management (IAM)
- **Authentication**: Email/password credentials with Argon2/bcrypt hashing, optional OAuth providers, secure HTTP-only session cookies.
- **Role-Based Access Control (RBAC)**: Enforced via Next.js middleware and API route handlers. Roles: `PATIENT`, `DOCTOR`, `ADMIN`, `SUPER_ADMIN`.
- **Horizontal Access Guarding**: Strict identity-ownership checking ensures users can only access records specifically assigned to them.

### 2.2 Doctor Availability & Scheduling Engine
- **Slot Generator**: Computes available consultation slots based on recurring doctor weekly templates, excluding past appointments and doctor leave intervals.
- **Concurrency & Concurrency Locking**: Employs transactional isolation (Serializable / row-level locks) to prevent double-booking identical time slots.
- **Lifecycle Machine**: Enforces valid state transitions:
  `REQUESTED` -> `CONFIRMED` -> `IN_PROGRESS` -> `COMPLETED` (or `CANCELLED` / `NO_SHOW`).

### 2.3 Virtual Consultation & Telehealth Subsystem
- **Signaling Service**: Coordinates WebRTC session descriptions (SDP offer/answer) and ICE candidates between patient and doctor.
- **Waiting Room**: Authenticates both parties, confirms camera/mic permissions, and only admits the patient when the doctor initializes the session.
- **Peer-to-Peer Media**: Media streams flow directly between peers with DTLS-SRTP encryption, maintaining clinical confidentiality without central media recording.
- **Clinical Records**: Doctors record diagnoses and prescription details during the session, saving them directly to the patient's record on call completion.

### 2.4 Medical Knowledge Base
- **Disease Catalog**: Structured disease profiles containing clinical descriptions, common symptoms, causes, preventative actions, and red-flag escalation triggers.
- **Medicine Reference**: Validated pharmaceutical index detailing generic compounds, brand names, therapeutic classes, dosage parameters, contraindications, and potential adverse interactions.
- **SEO & Performance**: Server-rendered with semantic HTML and JSON-LD schema for search engine discoverability.

### 2.5 AI Health Assistant & Clinical Triage Engine
- **Conversational Triage**: Guides patients through structured symptom exploration to recommend appropriate medical specialties.
- **Safety Boundary Pipeline**:
  1. *Input Sanitization*: Strips personally identifiable information.
  2. *Emergency Keyword & Heuristic Detection*: Detects acute emergencies (e.g., myocardial infarction, stroke, severe trauma) and triggers emergency mode.
  3. *Prompt Shielding*: Enforces system prompts forbidding definitive diagnosis and drug prescription.
  4. *Response Verification*: Validates disclaimer inclusion before rendering to client.

### 2.6 Audit & Compliance Subsystem
- **Audit Logging**: Any query or mutation touching sensitive patient data (profiles, medical histories, consultation notes) writes an immutable record to the `AuditLog` table.
- **Data Minimization**: Minimizes stored patient information and excludes private health data from application logs and analytics.

---

## 3. Communication Patterns

| Channel | Protocol | Usage |
|---|---|---|
| **Client-Server REST** | HTTPS (JSON) | Standard queries, bookings, profile updates, and admin actions |
| **AI Chat Streaming** | HTTPS (Server-Sent Events) | Real-time token streaming for AI assistant responses |
| **Realtime Signaling** | WSS (WebSockets) | WebRTC room coordination and waiting room presence updates |
| **Video/Audio Media** | WebRTC (SRTP/UDP) | Encrypted peer-to-peer audio and video transmission |
| **Database Access** | TCP (PostgreSQL Connection Pooling) | Prisma ORM queries with transaction support |

---

## 4. Architectural Quality Attributes

1. **Confidentiality & Privacy**: End-to-end media encryption, TLS 1.3 everywhere, strict RBAC, and zero client-side caching of cross-patient records.
2. **Reliability & Consistency**: Database ACID guarantees prevent double-booking; resilient error handling surfaces informative feedback to users without exposing stack traces.
3. **Usability & Aesthetics**: Clean clinical aesthetic using cohesive vanilla CSS variables, responsive design across mobile/desktop, and WCAG AA accessibility compliance.
4. **Maintainability**: Clear folder boundaries, isolated single-responsibility components, and 100% TypeScript type coverage.
