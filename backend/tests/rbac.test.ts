import { describe, it, expect } from 'vitest';
import {
  isRoleAllowed,
  assertPatientOwnership,
  assertDoctorOwnership,
} from '../src/middleware/rbac.js';
import { AppError } from '../src/middleware/errorHandler.js';
import type { SessionPayload } from '../src/types/index.js';

describe('Backend RBAC & Cross-User Protection', () => {
  const patient1: SessionPayload = {
    userId: 'patient-1',
    email: 'p1@clinic.com',
    name: 'Patient One',
    role: 'PATIENT',
    status: 'ACTIVE',
  };

  const patient2: SessionPayload = {
    userId: 'patient-2',
    email: 'p2@clinic.com',
    name: 'Patient Two',
    role: 'PATIENT',
    status: 'ACTIVE',
  };

  const doctor1: SessionPayload = {
    userId: 'doctor-1',
    email: 'doc1@clinic.com',
    name: 'Dr. One',
    role: 'DOCTOR',
    status: 'ACTIVE',
  };

  const doctor2: SessionPayload = {
    userId: 'doctor-2',
    email: 'doc2@clinic.com',
    name: 'Dr. Two',
    role: 'DOCTOR',
    status: 'ACTIVE',
  };

  const admin: SessionPayload = {
    userId: 'admin-1',
    email: 'admin@clinic.com',
    name: 'Admin',
    role: 'ADMIN',
    status: 'ACTIVE',
  };

  const superAdmin: SessionPayload = {
    userId: 'super-1',
    email: 'super@clinic.com',
    name: 'Super Admin',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
  };

  describe('Role Allowance', () => {
    it('should correctly evaluate role allowances', () => {
      expect(isRoleAllowed('PATIENT', ['PATIENT', 'DOCTOR'])).toBe(true);
      expect(isRoleAllowed('PATIENT', ['DOCTOR', 'ADMIN'])).toBe(false);
      expect(isRoleAllowed('ADMIN', ['ADMIN', 'SUPER_ADMIN'])).toBe(true);
      expect(isRoleAllowed('DOCTOR', ['ADMIN'])).toBe(false);
    });
  });

  describe('Patient Ownership Enforcement', () => {
    it('should allow patient to access own record', () => {
      expect(() => assertPatientOwnership(patient1, 'patient-1')).not.toThrow();
    });

    it('SECURITY: should prevent patient from accessing another patient record', () => {
      expect(() => assertPatientOwnership(patient2, 'patient-1')).toThrow(AppError);
    });

    it('SECURITY: should prevent doctor from accessing patient record without explicit assignment', () => {
      expect(() => assertPatientOwnership(doctor1, 'patient-1')).toThrow(AppError);
    });

    it('should allow admin and super admin operational access', () => {
      expect(() => assertPatientOwnership(admin, 'patient-1')).not.toThrow();
      expect(() => assertPatientOwnership(superAdmin, 'patient-1')).not.toThrow();
    });
  });

  describe('Doctor Profile Ownership', () => {
    it('should allow doctor to edit own profile', () => {
      expect(() => assertDoctorOwnership(doctor1, 'doctor-1')).not.toThrow();
    });

    it('SECURITY: should prevent doctor from editing another doctor profile', () => {
      expect(() => assertDoctorOwnership(doctor2, 'doctor-1')).toThrow(AppError);
    });

    it('SECURITY: should prevent patient from editing doctor profile', () => {
      expect(() => assertDoctorOwnership(patient1, 'doctor-1')).toThrow(AppError);
    });

    it('should allow super admin to modify doctor profile', () => {
      expect(() => assertDoctorOwnership(superAdmin, 'doctor-1')).not.toThrow();
    });
  });
});
