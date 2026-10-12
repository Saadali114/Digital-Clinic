'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '@/lib/apiClient';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT');
  const [specialization, setSpecialization] = useState('General Practice');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsLoading(true);

    try {
      const payload: {
        name: string;
        email: string;
        password: string;
        role: 'PATIENT' | 'DOCTOR';
        specialization?: string;
      } = {
        name,
        email,
        password,
        role,
      };

      if (role === 'DOCTOR') {
        payload.specialization = specialization;
      }

      await apiClient.auth.register(payload);

      if (role === 'DOCTOR') {
        router.push('/doctor');
      } else {
        router.push('/patient');
      }
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.details) {
          setFieldErrors(err.details);
        }
      } else {
        setError('A network error occurred while connecting to the backend API.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="container-narrow">
      <div className="card">
        <div className="card-header" style={{ textAlign: 'center' }}>
          <h1 className="card-title">Create a MediConnect Account</h1>
          <p className="card-subtitle">
            Register as a patient seeking care or a medical doctor providing consultations
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="role">
              I am registering as:
            </label>
            <select
              id="role"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value as 'PATIENT' | 'DOCTOR')}
              disabled={isLoading}
            >
              <option value="PATIENT">Patient (Book appointments & consultations)</option>
              <option value="DOCTOR">Medical Doctor (Provide clinical care)</option>
            </select>
            <small style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', display: 'block', marginTop: 'var(--space-1)' }}>
              Administrative roles cannot be self-assigned through public registration.
            </small>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Legal Name
            </label>
            <input
              id="name"
              type="text"
              required
              className={`form-input ${fieldErrors.name ? 'input-error' : ''}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Jane Smith or John Doe"
              autoComplete="name"
              disabled={isLoading}
            />
            {fieldErrors.name && (
              <p className="form-error">{fieldErrors.name.join(', ')}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              disabled={isLoading}
            />
            {fieldErrors.email && (
              <p className="form-error">{fieldErrors.email.join(', ')}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className={`form-input ${fieldErrors.password ? 'input-error' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 chars with uppercase, lowercase & digit"
              autoComplete="new-password"
              disabled={isLoading}
            />
            {fieldErrors.password && (
              <p className="form-error">{fieldErrors.password.join(', ')}</p>
            )}
          </div>

          {role === 'DOCTOR' && (
            <div className="form-group">
              <label className="form-label" htmlFor="specialization">
                Primary Medical Specialization
              </label>
              <input
                id="specialization"
                type="text"
                required
                className={`form-input ${fieldErrors.specialization ? 'input-error' : ''}`}
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Cardiology, Pediatrics, General Medicine"
                disabled={isLoading}
              />
              {fieldErrors.specialization && (
                <p className="form-error">{fieldErrors.specialization.join(', ')}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
