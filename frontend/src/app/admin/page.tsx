'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import type { UserSummary } from '@/types';

export default function AdminConsolePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.auth
      .me()
      .then((data) => {
        if (!data.user) {
          router.push('/login?callbackUrl=/admin');
          return;
        }

        if (data.user.role !== 'ADMIN' && data.user.role !== 'SUPER_ADMIN') {
          router.push('/unauthorized');
          return;
        }

        setUser(data.user);
      })
      .catch(() => {
        router.push('/login?callbackUrl=/admin');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router]);

  if (isLoading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Verifying administrative permissions with Express backend...</p>
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
            <h1 className="card-title">Administrative Console</h1>
            <p className="card-subtitle">
              Welcome, {user.name}. Administrative privileges verified.
            </p>
          </div>
          <span className="badge badge-admin">{user.role} PRIVILEGE ACTIVE</span>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface-subtle)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-2)' }}>
            Phase 1 Authorization Verification
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
            This page verifies that privileged administrative access is protected on the Express backend against unauthorized patient or doctor sessions.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)', fontSize: 'var(--font-size-sm)' }}>
            <div><strong>Administrator ID:</strong> <span style={{ fontFamily: 'var(--font-family-mono)' }}>{user.id}</span></div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Privilege Level:</strong> {user.role}</div>
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
