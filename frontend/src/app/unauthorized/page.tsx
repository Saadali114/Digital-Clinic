import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="container-narrow">
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)' }}>
        <div style={{ marginBottom: 'var(--space-4)', color: 'var(--color-danger)' }}>
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ margin: '0 auto' }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </div>

        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
          Access Denied
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', maxWidth: '440px', margin: '0 auto var(--space-6) auto' }}>
          You do not have the required role or permissions to access this clinical portal. Backend role-based access control (RBAC) has protected this endpoint.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)' }}>
          <Link href="/" className="btn btn-secondary">
            Return Home
          </Link>
          <Link href="/login" className="btn btn-primary">
            Sign In with Different Role
          </Link>
        </div>
      </div>
    </div>
  );
}
