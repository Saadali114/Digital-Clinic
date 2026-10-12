'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/apiClient';
import type { UserSummary } from '@/types';

export default function HomePage() {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [backendHealth, setBackendHealth] = useState<{
    status: string;
    services?: { api: string; database: string };
  } | null>(null);
  const [isHealthLoading, setIsHealthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check backend health
    apiClient
      .health()
      .then((data) => {
        if (mounted) {
          setBackendHealth(data);
        }
      })
      .catch(() => {
        if (mounted) {
          setBackendHealth({ status: 'unreachable' });
        }
      })
      .finally(() => {
        if (mounted) {
          setIsHealthLoading(false);
        }
      });

    // Check current session
    apiClient.auth
      .me()
      .then((data) => {
        if (mounted && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {
        if (mounted) {
          setUser(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: 'var(--space-10) var(--space-6)' }}>
        <div style={{ marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <span className="badge badge-patient" style={{ padding: 'var(--space-1) var(--space-3)' }}>
            Phase 1 Monorepo Active
          </span>
          <span
            className="badge"
            style={{
              padding: 'var(--space-1) var(--space-3)',
              backgroundColor:
                backendHealth?.status === 'ok'
                  ? 'var(--color-success-bg)'
                  : backendHealth?.status === 'degraded'
                  ? 'var(--color-warning-bg)'
                  : 'var(--color-danger-bg)',
              color:
                backendHealth?.status === 'ok'
                  ? 'var(--color-success-text)'
                  : backendHealth?.status === 'degraded'
                  ? 'var(--color-warning-text)'
                  : 'var(--color-danger-text)',
            }}
          >
            Backend API:{' '}
            {isHealthLoading
              ? 'Checking...'
              : backendHealth?.status === 'ok'
              ? 'Online (Port 5000)'
              : backendHealth?.status === 'degraded'
              ? 'API Online / DB Disconnected'
              : 'Offline'}
          </span>
        </div>

        <h1 style={{ fontSize: 'var(--font-size-3xl)', color: 'var(--color-primary-dark)', marginBottom: 'var(--space-3)' }}>
          Welcome to MediConnect
        </h1>
        <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', maxWidth: '600px', margin: '0 auto var(--space-6) auto' }}>
          An AI-powered digital clinic platform built with a separated architecture: Next.js App Router frontend communicating with an independent Node.js Express REST API backend (`/api/v1`).
        </p>

        {user ? (
          <div style={{ backgroundColor: 'var(--color-surface-subtle)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', textAlign: 'left', marginBottom: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-2)' }}>
              Active Session (Verified via Express Backend)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Name:</span>
                <strong>{user.name}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Email:</span>
                <strong>{user.email}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Role:</span>
                <span className={`badge badge-${user.role.toLowerCase()}`}>{user.role}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Status:</span>
                <span style={{ color: 'var(--color-success-text)', fontWeight: 'bold' }}>{user.status}</span>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-3)' }}>
              {user.role === 'PATIENT' && (
                <Link href="/patient" className="btn btn-primary">
                  Go to Patient Portal
                </Link>
              )}
              {user.role === 'DOCTOR' && (
                <Link href="/doctor" className="btn btn-primary">
                  Go to Doctor Workspace
                </Link>
              )}
              {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                <Link href="/admin" className="btn btn-primary">
                  Go to Admin Console
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <Link href="/login" className="btn btn-primary">
              Sign In to Your Account
            </Link>
            <Link href="/register" className="btn btn-secondary">
              Register as Patient or Doctor
            </Link>
          </div>
        )}

        <div style={{ marginTop: 'var(--space-8)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)', textAlign: 'left' }}>
          <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)' }}>
            Architecture & Security Highlights
          </h2>
          <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-3)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            <li>✔ Separated Frontend (Next.js 15) & Backend (Express)</li>
            <li>✔ Versioned REST API under <code>/api/v1</code></li>
            <li>✔ Centralized API Client with Credentialed Cookies</li>
            <li>✔ PostgreSQL & Prisma Schema in <code>backend/prisma</code></li>
            <li>✔ Salted Bcrypt Password Hashing & Jose HS256 JWT</li>
            <li>✔ Public Registration Role Escalation Defenses</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
