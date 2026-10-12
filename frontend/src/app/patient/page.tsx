'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import type { UserSummary } from '@/types';

export default function PatientPortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.auth
      .me()
      .then((data) => {
        if (!data.user) {
          router.push('/login?callbackUrl=/patient');
          return;
        }

        if (
          data.user.role !== 'PATIENT' &&
          data.user.role !== 'ADMIN' &&
          data.user.role !== 'SUPER_ADMIN'
        ) {
          router.push('/unauthorized');
          return;
        }

        setUser(data.user);
      })
      .catch(() => {
        router.push('/login?callbackUrl=/patient');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router]);

  if (isLoading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Verifying patient session with Express backend...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <div>
            <h1 className="card-title">Patient Portal</h1>
            <p className="card-subtitle">
              Welcome, {user.name}. Your patient session is authorized.
            </p>
          </div>
          <span className="badge badge-patient">{user.role} ACCESS GRANTED</span>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface-subtle)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-2)' }}>
            Phase 1 Authorization Verification
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
            This page verifies that the Express REST backend (`/api/v1/auth/me`) has authenticated the patient session with secure HTTP-only cookies.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)', fontSize: 'var(--font-size-sm)' }}>
            <div><strong>User ID:</strong> <span style={{ fontFamily: 'var(--font-family-mono)' }}>{user.id}</span></div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Status:</strong> {user.status}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button
            onClick={async () => {
              await apiClient.auth.logout();
              router.push('/login');
              router.refresh();
            }}
            className="btn btn-secondary"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
