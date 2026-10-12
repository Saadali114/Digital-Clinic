'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import type { UserSummary } from '@/types';

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<UserSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
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
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.auth.logout();
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          <svg
            className="brand-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path d="M12 5v6m-3-3h6" />
          </svg>
          <span>MediConnect</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link href="/" className="nav-link">
                Home
              </Link>
            </li>
            {!isLoading && user ? (
              <>
                {user.role === 'PATIENT' && (
                  <li>
                    <Link href="/patient" className="nav-link">
                      Patient Portal
                    </Link>
                  </li>
                )}
                {user.role === 'DOCTOR' && (
                  <li>
                    <Link href="/doctor" className="nav-link">
                      Doctor Workspace
                    </Link>
                  </li>
                )}
                {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                  <li>
                    <Link href="/admin" className="nav-link">
                      Admin Console
                    </Link>
                  </li>
                )}
                <li>
                  <span className={`badge badge-${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                    Sign Out
                  </button>
                </li>
              </>
            ) : !isLoading ? (
              <>
                <li>
                  <Link href="/login" className="nav-link">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="btn btn-primary btn-sm">
                    Create Account
                  </Link>
                </li>
              </>
            ) : null}
          </ul>
        </nav>
      </div>
    </header>
  );
}
