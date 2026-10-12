# MediConnect — Planned API Contract & Endpoints Specification

> **Document Status**: Proposed API Blueprint (Unverified until Phase 1+ Implementation)  
> **Last Updated**: 2026-10-12  
> **Protocol**: HTTPS REST & Server-Sent Events (SSE)

---

## 1. Authentication & Session Module (`/api/auth`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/auth/register` | `POST` | Public | Registers a new user (`PATIENT` or `DOCTOR`). Validates schema with Zod. |
| `/api/auth/login` | `POST` | Public | Validates credentials, issues secure HTTP-only session cookie. |
| `/api/auth/logout` | `POST` | Authenticated | Clears session cookie and invalidates server token. |
| `/api/auth/session` | `GET` | Authenticated | Returns current authenticated user details and active role. |

---

## 2. User & Profiles Module (`/api/users`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/users/me` | `GET` | Authenticated | Fetches profile for current user (Patient or Doctor). |
| `/api/users/patient-profile` | `PATCH` | Patient | Updates medical history, allergies, emergency contacts. |
| `/api/users/doctor-profile` | `PATCH` | Doctor | Updates bio, consultation fee, specialties, clinic address. |
| `/api/users/change-password` | `POST` | Authenticated | Changes password after validating old password. |

---

## 3. Doctor Discovery & Public Directory (`/api/doctors`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/doctors` | `GET` | Public | Paginated list of verified doctors. Filters: `specialty`, `feeMax`, `ratingMin`, `search`. |
| `/api/doctors/:id` | `GET` | Public | Public profile for a verified doctor including specialties, bio, fee, reviews. |
| `/api/doctors/:id/slots` | `GET` | Public | Available (unbooked) time slots for a specific doctor within a date range. |
| `/api/specialties` | `GET` | Public | List of all medical specialties with doctor counts. |

---

## 4. Scheduling & Appointments Module (`/api/appointments`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/appointments` | `GET` | Authenticated | List appointments for current user. Filtered by role (Patient or Doctor). |
| `/api/appointments` | `POST` | Patient | Books an appointment. Uses database row locks to prevent double-booking. |
| `/api/appointments/:id` | `GET` | Patient / Doctor | Fetches details of a specific appointment. Strict ownership check. |
| `/api/appointments/:id/status` | `PATCH` | Doctor / Patient | Updates status (`CONFIRMED`, `CANCELLED`). Enforces state machine rules. |
| `/api/appointments/:id/reschedule` | `PATCH` | Patient / Doctor | Selects a new slot and updates appointment date. |

---

## 5. Doctor Schedule Management (`/api/doctor/schedule`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/doctor/schedule/slots` | `GET` | Doctor | Lists all doctor slots (booked and available) within a date range. |
| `/api/doctor/schedule/slots` | `POST` | Doctor | Creates single or recurring availability slots. |
| `/api/doctor/schedule/slots/:id` | `DELETE` | Doctor | Removes an unbooked availability slot. |

---

## 6. Telehealth & Online Consultations (`/api/consultations`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/consultations/:appointmentId/token` | `POST` | Patient / Doctor | Generates authorized WebRTC room join token within 15 min of scheduled time. |
| `/api/consultations/:appointmentId/start` | `POST` | Doctor | Marks session as `IN_PROGRESS`, records start timestamp. |
| `/api/consultations/:appointmentId/complete` | `POST` | Doctor | Concludes session, saves doctor clinical notes and diagnosis summary. |
| `/api/consultations/:appointmentId/prescription` | `POST` | Doctor | Creates prescription items attached to the consultation session. |
| `/api/consultations/:appointmentId/summary` | `GET` | Patient / Doctor | Retrieves post-consultation summary and prescriptions. |

---

## 7. Medical Information Library (`/api/library`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/library/diseases` | `GET` | Public | Searchable and indexed list of disease articles. |
| `/api/library/diseases/:slug` | `GET` | Public | Complete article details (symptoms, causes, risk factors, prevention). |
| `/api/library/medicines` | `GET` | Public | Searchable list of pharmaceuticals by generic and brand name. |
| `/api/library/medicines/:slug` | `GET` | Public | Complete medicine details (indications, dosage guidance, contraindications). |

---

## 8. AI Health Assistant (`/api/ai`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/ai/chat` | `POST` | Public / Patient | Streams AI triage response via SSE. Enforces medical safety prompt guardrails. |
| `/api/ai/triage-check` | `POST` | Public / Patient | Analyzes symptoms and flags emergency red-flags; returns recommended specialty. |

---

## 9. Administration & Operations (`/api/admin`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/admin/doctors/pending` | `GET` | Admin | Lists doctors awaiting credential verification. |
| `/api/admin/doctors/:id/verify` | `POST` | Admin | Approves or rejects doctor license with review notes. |
| `/api/admin/users/:id/status` | `PATCH` | Admin | Updates user status (`ACTIVE`, `SUSPENDED`). |
| `/api/admin/library/diseases` | `POST/PUT/DEL` | Admin | CRUD operations on disease articles. |
| `/api/admin/library/medicines` | `POST/PUT/DEL` | Admin | CRUD operations on medicine articles. |
| `/api/admin/audit-logs` | `GET` | Admin | Paginated immutable audit trail with filters by user, action, and date. |

---

## 10. Notifications Module (`/api/notifications`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/notifications` | `GET` | Authenticated | Lists in-app notifications for the logged-in user. |
| `/api/notifications/:id/read` | `PATCH` | Authenticated | Marks a specific notification as read. |
| `/api/notifications/read-all` | `POST` | Authenticated | Marks all user notifications as read. |
