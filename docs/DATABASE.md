# MediConnect — Proposed Database Specification & Schema

> **Document Status**: Proposed Schema Blueprint (Unverified until Phase 1+ Implementation)  
> **Last Updated**: 2026-10-12  
> **Target Database**: PostgreSQL (via Prisma ORM / Supabase)

---

## 1. Entity-Relationship Overview

```
                  +-------------------+
                  |       User        |
                  +---------+---------+
                            |
           +----------------+----------------+
           | 1:1                             | 1:1
+----------v----------+           +----------v----------+
|   PatientProfile    |           |    DoctorProfile    |
+----------+----------+           +----------+----------+
           |                                 |
           | 1:N                             | 1:N
           |                      +----------v----------+
           |                      |  AvailabilitySlot   |
           |                      +----------+----------+
           |                                 | 1:N
           +----------------+----------------+
                            |
                  +---------v---------+
                  |    Appointment    |
                  +---------+---------+
                            | 1:1
              +-------------v--------------+
              |    ConsultationSession     |
              +-------------+--------------+
                            | 1:N
                  +---------v---------+
                  |   Prescription    |
                  +-------------------+

Catalog & Operational Entities:
- Specialty (M:N with DoctorProfile)
- DiseaseArticle (Independent medical content)
- MedicineArticle (Independent pharmaceutical catalog)
- Notification (1:N with User)
- AuditLog (1:N with User, append-only)
```

---

## 2. Entity Definitions & Fields

### 2.1 User
Central identity table storing authentication credentials and platform roles.
- `id`: UUID (Primary Key)
- `email`: String (Unique, Indexed)
- `passwordHash`: String (Argon2 / bcrypt)
- `role`: Enum (`PATIENT`, `DOCTOR`, `ADMIN`, `SUPER_ADMIN`)
- `status`: Enum (`ACTIVE`, `PENDING_VERIFICATION`, `SUSPENDED`)
- `emailVerified`: DateTime (Nullable)
- `createdAt`: DateTime (Default: now())
- `updatedAt`: DateTime (Auto-updated)

### 2.2 PatientProfile
Health profile linked 1:1 to a User with role `PATIENT`.
- `id`: UUID (Primary Key)
- `userId`: UUID (Unique, Foreign Key -> User.id, Cascade Delete)
- `fullName`: String
- `dateOfBirth`: Date
- `gender`: Enum (`MALE`, `FEMALE`, `OTHER`, `PREFER_NOT_TO_SAY`)
- `bloodGroup`: String (Nullable)
- `emergencyContact`: String (Nullable)
- `allergies`: String[] (Array of strings)
- `chronicConditions`: String[] (Array of strings)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### 2.3 DoctorProfile
Professional and clinical credentials linked 1:1 to a User with role `DOCTOR`.
- `id`: UUID (Primary Key)
- `userId`: UUID (Unique, Foreign Key -> User.id, Cascade Delete)
- `fullName`: String
- `licenseNumber`: String (Unique, Indexed)
- `verificationStatus`: Enum (`PENDING`, `VERIFIED`, `REJECTED`)
- `verificationNotes`: Text (Nullable, Admin review feedback)
- `bio`: Text
- `consultationFee`: Decimal(10, 2)
- `yearsOfExperience`: Integer
- `clinicAddress`: Text (Nullable)
- `rating`: Decimal(3, 2) (Default: 5.0)
- `totalReviews`: Integer (Default: 0)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### 2.4 Specialty & DoctorSpecialty
Medical disciplines.
- `id`: UUID (Primary Key)
- `name`: String (Unique)
- `slug`: String (Unique)
- `description`: Text
- `icon`: String (Nullable)
- *Join table*: `DoctorSpecialty` (`doctorId` -> DoctorProfile.id, `specialtyId` -> Specialty.id)

### 2.5 AvailabilitySlot
Doctor scheduling slots.
- `id`: UUID (Primary Key)
- `doctorId`: UUID (Foreign Key -> DoctorProfile.id, Cascade Delete)
- `startTime`: DateTime (Indexed)
- `endTime`: DateTime (Indexed)
- `isBooked`: Boolean (Default: false)
- `isRecurring`: Boolean (Default: false)
- `dayOfWeek`: Integer (Nullable, 0-6 for recurring templates)
- `createdAt`: DateTime

### 2.6 Appointment
Core scheduling record between a Patient and a Doctor.
- `id`: UUID (Primary Key)
- `patientId`: UUID (Foreign Key -> PatientProfile.id)
- `doctorId`: UUID (Foreign Key -> DoctorProfile.id)
- `slotId`: UUID (Unique, Foreign Key -> AvailabilitySlot.id)
- `scheduledAt`: DateTime (Indexed)
- `status`: Enum (`REQUESTED`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `NO_SHOW`)
- `type`: Enum (`VIDEO`, `IN_PERSON`)
- `reasonForVisit`: Text
- `cancellationReason`: Text (Nullable)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### 2.7 ConsultationSession
Clinical record of an online video consultation.
- `id`: UUID (Primary Key)
- `appointmentId`: UUID (Unique, Foreign Key -> Appointment.id)
- `roomId`: String (Unique, WebRTC room identifier)
- `startedAt`: DateTime (Nullable)
- `endedAt`: DateTime (Nullable)
- `doctorNotes`: Text (Encrypted at rest, clinical observations)
- `diagnosisSummary`: Text (Nullable)
- `followUpDate`: Date (Nullable)
- `createdAt`: DateTime

### 2.8 Prescription
Medication instructions issued during a consultation.
- `id`: UUID (Primary Key)
- `sessionId`: UUID (Foreign Key -> ConsultationSession.id)
- `medicationName`: String
- `dosage`: String (e.g., "500mg")
- `frequency`: String (e.g., "Twice daily after meals")
- `duration`: String (e.g., "7 days")
- `instructions`: Text (Nullable)
- `createdAt`: DateTime

### 2.9 DiseaseArticle
Curated medical knowledge library.
- `id`: UUID (Primary Key)
- `name`: String
- `slug`: String (Unique, Indexed)
- `overview`: Text
- `symptoms`: String[]
- `causes`: String[]
- `riskFactors`: String[]
- `prevention`: Text
- `whenToSeeDoctor`: Text
- `isReviewed`: Boolean (Default: false)
- `reviewedByDoctorId`: UUID (Nullable, Foreign Key -> DoctorProfile.id)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### 2.10 MedicineArticle
Pharmaceutical reference catalog.
- `id`: UUID (Primary Key)
- `genericName`: String
- `brandNames`: String[]
- `slug`: String (Unique, Indexed)
- `drugClass`: String
- `indications`: Text
- `dosageGuidance`: Text
- `contraindications`: Text
- `sideEffects`: String[]
- `warnings`: Text
- `createdAt`: DateTime
- `updatedAt`: DateTime

### 2.11 Notification
In-app notification system.
- `id`: UUID (Primary Key)
- `userId`: UUID (Foreign Key -> User.id, Cascade Delete)
- `title`: String
- `message`: Text
- `type`: Enum (`APPOINTMENT_REMINDER`, `BOOKING_CONFIRMED`, `CALL_READY`, `SYSTEM`)
- `isRead`: Boolean (Default: false)
- `link`: String (Nullable)
- `createdAt`: DateTime

### 2.12 AuditLog
Immutable security log for sensitive data access compliance.
- `id`: UUID (Primary Key)
- `userId`: UUID (Nullable, Foreign Key -> User.id)
- `action`: String (e.g., "VIEW_CONSULTATION_NOTE", "UPDATE_ROLE", "EXPORT_RECORD")
- `resourceType`: String (e.g., "ConsultationSession", "User")
- `resourceId`: String
- `ipAddress`: String (Nullable)
- `userAgent`: String (Nullable)
- `metadata`: JSON (Additional context, strictly excluding raw PHI)
- `timestamp`: DateTime (Default: now(), Indexed)

---

## 3. Data Access & Security Rules

1. **Patient Data Isolation**:
   - Patients can only query and mutate their own `PatientProfile`, linked `Appointment` rows, and consultation summaries.
   - Database queries must explicitly enforce `WHERE patientId = session.user.patientId`.
2. **Doctor Clinical Scope**:
   - Doctors can only view appointments and clinical consultation notes for patients who have an active or historical appointment with them.
   - Unassigned patient records are strictly inaccessible to doctors.
3. **Admin Segregation**:
   - Administrators have read/write access to `DoctorProfile` verifications, `DiseaseArticle`, and `MedicineArticle`.
   - Administrators cannot view clinical consultation notes or private prescription notes without an auditable compliance request.
4. **Concurrency Guarantees on Booking**:
   - Booking an appointment must execute within a database transaction:
     ```sql
     BEGIN TRANSACTION;
     SELECT * FROM "AvailabilitySlot" WHERE id = $slotId AND "isBooked" = false FOR UPDATE;
     -- If slot is available:
     UPDATE "AvailabilitySlot" SET "isBooked" = true WHERE id = $slotId;
     INSERT INTO "Appointment" ...;
     COMMIT;
     ```
5. **Audit Immutability**:
   - The `AuditLog` table has no `UPDATE` or `DELETE` API endpoints. Only `INSERT` is permitted.
