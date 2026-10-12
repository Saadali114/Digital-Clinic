'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled frontend application error:', error);
  }, [error]);

  return (
    <div className="container-narrow">
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-danger)', marginBottom: 'var(--space-2)' }}>
          Something went wrong
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
          An unexpected error occurred while communicating with the MediConnect platform.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)' }}>
          <button onClick={() => reset()} className="btn btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn btn-secondary">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
