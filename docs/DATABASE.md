# MediConnect — Database Specification & Schema

> **Document Status**: Finalized Architecture (PostgreSQL via Prisma ORM on Express Backend)  
> **Last Updated**: 2026-10-12  
> **Location**: `backend/prisma/schema.prisma`

---

## 1. Persistence Tier Responsibilities

In MediConnect's monorepo architecture, the database and ORM reside exclusively in the **Express backend**:
- **Location**: `backend/prisma/schema.prisma`
- **Database Client**: `backend/src/config/db.ts`
- **Migrations**: Generated and executed inside `backend/` using `npx prisma migrate dev`
- **Frontend Access**: The Next.js frontend has **zero** direct database connection or database credentials. All database interactions occur via Express REST endpoints.

---

## 2. Entity-Relationship Model (Phase 1 Baseline)

```
                  +-------------------+
                  |       User        |
                  +---------+---------+
                            |
           +----------------+----------------+
           | 1:1                             | 1:1
+----------v----------+           +----------v----------+
|   PatientProfile    |           |    DoctorProfile    |
+---------------------+           +----------+----------+
                                             | 1:N
                                  +----------v----------+
                                  |  DoctorCredential   |
                                  +---------------------+
```

### Models & Constraints
1. **User**:
   - `id`: UUID (Primary Key)
   - `name`: String
   - `email`: String (Unique, Indexed, Lowercase Normalized)
   - `passwordHash`: String (Bcrypt Salted Hash)
   - `role`: Enum (`PATIENT`, `DOCTOR`, `ADMIN`, `SUPER_ADMIN`, Default: `PATIENT`)
   - `status`: Enum (`ACTIVE`, `PENDING_VERIFICATION`, `SUSPENDED`, Default: `ACTIVE`)
   - `createdAt`, `updatedAt`: DateTime
   - Relations: `patientProfile` (1:1), `doctorProfile` (1:1)

2. **PatientProfile**:
   - `id`: UUID (Primary Key)
   - `userId`: UUID (Unique, Foreign Key -> `User.id`, Cascade Delete)
   - `dateOfBirth`: DateTime (Nullable)
   - `gender`: Enum (`MALE`, `FEMALE`, `OTHER`, `PREFER_NOT_TO_SAY`)
   - `bloodGroup`: String (Nullable)
   - `emergencyContact`: String (Nullable)
   - `allergies`: String[]
   - `createdAt`, `updatedAt`: DateTime

3. **DoctorProfile**:
   - `id`: UUID (Primary Key)
   - `userId`: UUID (Unique, Foreign Key -> `User.id`, Cascade Delete)
   - `specialization`: String (Indexed)
   - `qualifications`: String[]
   - `yearsOfExperience`: Integer (Default: 0)
   - `consultationFee`: Decimal(10, 2) (Default: 0.0)
   - `verificationStatus`: Enum (`PENDING`, `VERIFIED`, `REJECTED`, Default: `PENDING`)
   - `verificationNotes`: String (Nullable)
   - `createdAt`, `updatedAt`: DateTime
   - Relations: `credentials` (1:N DoctorCredential)

4. **DoctorCredential**:
   - `id`: UUID (Primary Key)
   - `doctorProfileId`: UUID (Foreign Key -> `DoctorProfile.id`, Cascade Delete)
   - `credentialType`: Enum (`MEDICAL_LICENSE`, `BOARD_CERTIFICATION`, `DEGREE`, `GOVERNMENT_ID`)
   - `documentUrl`: String (Nullable)
   - `verificationStatus`: Enum (`PENDING`, `VERIFIED`, `REJECTED`, Default: `PENDING`)
   - `verifiedAt`: DateTime (Nullable)
   - `createdAt`, `updatedAt`: DateTime

---

## 3. Migration and Connection Rules

- Migrations are tracked in `backend/prisma/migrations/`.
- `db push` is forbidden as a substitute for production migrations.
- Baseline migration `20261012142151_init` was successfully generated and applied to the live Supabase PostgreSQL database.
- Database connectivity verified with IPv4 Session Pooler (`aws-0-ap-south-1.pooler.supabase.com:5432`).
