'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';

type HeaderProps = {
  onOpenBriefing?: () => void;
};

export default function Header({ onOpenBriefing }: HeaderProps) {
  const pathname = usePathname();
  const { user, openLogin, logout } = useAuth();

  return (
    <header className="global-navbar">
      <div className="navbar-inner">
        {/* Brand Logo at Top Left */}
        <Link href="/" className="brand-logo">
          <div className="logo-icon">A</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="logo-title">ACME Salary Management</span>
            <span style={{ fontSize: '0.675rem', color: '#E9C46A', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              10,000 Staff Compensation Platform
            </span>
          </div>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
                Command Center
              </Link>
            </li>
            <li>
              <Link href="/directory" className={`nav-item ${pathname === '/directory' ? 'active' : ''}`}>
                10,000 Directory
              </Link>
            </li>
            <li>
              <Link href="/import" className={`nav-item ${pathname === '/import' ? 'active' : ''}`}>
                Excel Import 📊
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
          {onOpenBriefing && (
            <button
              type="button"
              onClick={onOpenBriefing}
              className="auth-btn auth-btn-outline"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: '#1D8A7A', color: '#ffffff', borderColor: '#1D8A7A' }}
              title="Open Daily HR Briefing Modal"
            >
              Daily Briefing 💡
            </button>
          )}

          {user ? (
            <>
              <span className="role-badge role-hr">HR Manager ({user.username})</span>
              <button type="button" onClick={logout} className="auth-btn auth-btn-outline">
                Logout
              </button>
            </>
          ) : (
            <>
              <span className="role-badge role-guest">Guest Mode</span>
              <button type="button" onClick={openLogin} className="auth-btn auth-btn-primary">
                HR Login
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
