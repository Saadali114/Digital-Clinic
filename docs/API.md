# MediConnect — Express Backend API Contract Specification

> **Document Status**: Finalized API Contract (`/api/v1` Express Backend)  
> **Last Updated**: 2026-10-12  
> **Base URL**: `http://localhost:5000/api/v1`

---

## 1. System & Health Endpoints

### `GET /api/v1/health`
Checks API server and database availability.

- **Access**: Public
- **Response Format** (Database Online):
  ```json
  {
    "status": "ok",
    "timestamp": "2026-10-12T19:00:00.000Z",
    "services": {
      "api": "healthy",
      "database": "connected"
    }
  }
  ```
- **Response Format** (Database Offline / P1001):
  ```json
  {
    "status": "degraded",
    "timestamp": "2026-10-12T19:00:00.000Z",
    "services": {
      "api": "healthy",
      "database": "disconnected"
    },
    "message": "Database is unreachable. API process is functioning."
  }
  ```

---

## 2. Authentication & Session Module (`/api/v1/auth`)

### `POST /api/v1/auth/register`
Creates a new patient or doctor account with linked profile.

- **Access**: Public (Rate-limited)
- **Security Guardrail**: Role input is strictly restricted to `PATIENT` or `DOCTOR`. Any payload specifying `ADMIN` or `SUPER_ADMIN` is rejected with `400 Bad Request`.
- **Request Body**:
  ```json
  {
    "name": "Dr. Sarah Connor",
    "email": "sarah@clinic.com",
    "password": "SecurePassword123!",
    "role": "DOCTOR",
    "specialization": "Cardiology"
  }
  ```
- **Response (201 Created)**:
  - Sets HTTP-only cookie: `mediconnect_session`
  ```json
  {
    "success": true,
    "user": {
      "id": "uuid",
      "name": "Dr. Sarah Connor",
      "email": "sarah@clinic.com",
      "role": "DOCTOR",
      "status": "ACTIVE"
    }
  }
  ```

### `POST /api/v1/auth/login`
Authenticates user and issues HTTP-only session cookie.

- **Access**: Public (Rate-limited)
- **Security Guardrail**: Anti-enumeration error messages. Suspended accounts receive `403 Forbidden`.
- **Request Body**:
  ```json
  {
    "email": "sarah@clinic.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response (200 OK)**:
  - Sets HTTP-only cookie: `mediconnect_session`
  ```json
  {
    "success": true,
    "user": {
      "id": "uuid",
      "name": "Dr. Sarah Connor",
      "email": "sarah@clinic.com",
      "role": "DOCTOR",
      "status": "ACTIVE"
    }
  }
  ```

### `POST /api/v1/auth/logout`
Terminates current session and clears session cookie.

- **Access**: Authenticated
- **Response (200 OK)**: Clears cookie and returns `{ "success": true, "message": "Successfully logged out" }`

### `GET /api/v1/auth/me`
Retrieves current authenticated user and linked profile information.

- **Access**: Authenticated (Patient, Doctor, Admin, Super Admin)
- **Security Guardrail**: Users can only retrieve their own profile information (`assertPatientOwnership` / `assertDoctorOwnership`).
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "uuid",
      "name": "Dr. Sarah Connor",
      "email": "sarah@clinic.com",
      "role": "DOCTOR",
      "status": "ACTIVE",
      "doctorProfile": {
        "id": "uuid",
        "specialization": "Cardiology",
        "verificationStatus": "PENDING"
      }
    }
  }
  ```

---

## 3. Planned Endpoints (Future Phases)

- **Phase 2**: `/api/v1/doctors`, `/api/v1/doctors/:id`, `/api/v1/specialties`
- **Phase 3**: `/api/v1/appointments`, `/api/v1/doctor/schedule`
- **Phase 4**: `/api/v1/consultations/:id/token`, `/api/v1/consultations/:id/notes`
- **Phase 5**: `/api/v1/library/diseases`, `/api/v1/library/medicines`
- **Phase 6**: `/api/v1/ai/triage`, `/api/v1/ai/chat`
- **Phase 7**: `/api/v1/admin/doctors/:id/verify`, `/api/v1/admin/audit-logs`
