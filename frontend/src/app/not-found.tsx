import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="container-narrow">
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10) var(--space-4)' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', color: 'var(--color-primary-dark)', marginBottom: 'var(--space-2)' }}>
          404 - Page Not Found
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
          The requested clinical page or resource could not be found.
        </p>
        <Link href="/" className="btn btn-primary">
          Return to MediConnect Home
        </Link>
      </div>
    </div>
  );
}
