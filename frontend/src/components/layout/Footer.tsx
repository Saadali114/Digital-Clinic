export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <p>© 2026 MediConnect. All rights reserved.</p>
          <p style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-1)' }}>
            Phase 1: Monorepo Foundation — Next.js Frontend & Dedicated Express REST API Backend.
          </p>
        </div>
        <div>
          <span className="badge badge-patient" style={{ fontSize: 'var(--font-size-xs)' }}>
            Clinical Safety & RBAC Protected
          </span>
        </div>
      </div>
    </footer>
  );
}
