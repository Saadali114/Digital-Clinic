export type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN' | 'SUPER_ADMIN';

export type AccountStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: AccountStatus;
  patientProfile?: {
    id: string;
    bloodGroup?: string | null;
    emergencyContact?: string | null;
    allergies: string[];
  } | null;
  doctorProfile?: {
    id: string;
    specialization: string;
    verificationStatus: VerificationStatus;
    consultationFee?: number;
    yearsOfExperience?: number;
  } | null;
}

export interface ApiResponse<T = unknown> {
  success?: boolean;
  user?: T;
  message?: string;
  error?: string;
  details?: Record<string, string[]>;
}
