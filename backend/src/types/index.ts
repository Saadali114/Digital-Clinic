export type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN' | 'SUPER_ADMIN';

export type AccountStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
  status: AccountStatus;
}

declare global {
  namespace Express {
    interface Request {
      user?: SessionPayload;
    }
  }
}
