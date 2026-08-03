'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import LoginModal from '../components/LoginModal';
import { AuthUser } from '../lib/api';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Restore stored session from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('acme_hr_token');
      const storedUser = localStorage.getItem('acme_hr_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load session from localStorage:', e);
    }
  }, []);

  const handleLoginSuccess = (authUser: AuthUser, authToken: string) => {
    setUser(authUser);
    setToken(authToken);
    try {
      localStorage.setItem('acme_hr_token', authToken);
      localStorage.setItem('acme_hr_user', JSON.stringify(authUser));
    } catch (e) {
      console.error('Failed to save session to localStorage:', e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('acme_hr_token');
      localStorage.removeItem('acme_hr_user');
    } catch (e) {
      console.error('Failed to clear session from localStorage:', e);
    }
  };

  return (
    <html lang="en">
      <head>
        <title>ACME Organization – Salary Management Platform</title>
        <meta name="description" content="Enterprise employee salary management and HR compensation analytics software for 10,000+ staff." />
      </head>
      <body>
        <Header
          user={user}
          onOpenLogin={() => setIsLoginOpen(true)}
          onLogout={handleLogout}
        />

        {/* Inject user & token down to child page via React context or cloneElement if needed */}
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<{ user?: AuthUser | null; token?: string | null }>, {
              user,
              token,
            })
          : children}

        <footer className="global-footer">
          <p>© {new Date().getFullYear()} ACME Organization. Global Employee Compensation & HR Intelligence System.</p>
        </footer>

        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      </body>
    </html>
  );
}
