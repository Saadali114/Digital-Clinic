'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient, ApiError } from '@/lib/apiClient';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiClient.auth.login({ email, password });

      if (callbackUrl && callbackUrl !== '/') {
        router.push(callbackUrl);
      } else {
        const role = response.user.role;
        if (role === 'DOCTOR') {
          router.push('/doctor');
        } else if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
          router.push('/admin');
        } else {
          router.push('/patient');
        }
      }
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('A network error occurred while connecting to the backend API.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header" style={{ textAlign: 'center' }}>
        <h1 className="card-title">Sign In to MediConnect</h1>
        <p className="card-subtitle">
          Access your digital clinic portal via the Express backend
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 'var(--space-2)' }}
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
        Don&apos;t have an account?{' '}
        <Link href="/register" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
          Register here
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="container-narrow">
      <Suspense fallback={
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Loading authentication form...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
