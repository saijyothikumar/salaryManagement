'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthUser } from '../lib/api';

type HeaderProps = {
  user: AuthUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
};

export default function Header({ user, onOpenLogin, onLogout }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="global-navbar">
      <div className="navbar-inner">
        <Link href="/" className="brand-logo">
          <div className="logo-icon">A</div>
          <span className="logo-title">ACME Salary Platform</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/directory" className={`nav-item ${pathname === '/directory' ? 'active' : ''}`}>
                Employee Directory
              </Link>
            </li>
            <li>
              <Link href="/support" className={`nav-item ${pathname === '/support' ? 'active' : ''}`}>
                Support & FAQ
              </Link>
            </li>
          </ul>
        </nav>

        <div className="nav-auth">
          {user ? (
            <>
              <span className="role-badge role-hr">HR Manager ({user.username})</span>
              <button type="button" onClick={onLogout} className="auth-btn auth-btn-outline">
                Logout
              </button>
            </>
          ) : (
            <>
              <span className="role-badge role-guest">Guest Mode (Read-Only)</span>
              <button type="button" onClick={onOpenLogin} className="auth-btn auth-btn-primary">
                HR Login
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
