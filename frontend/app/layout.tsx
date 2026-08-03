'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import LoginModal from '../components/LoginModal';
import WelcomeBriefingModal from '../components/WelcomeBriefingModal';
import { AuthProvider, useAuth } from '../lib/AuthContext';
import './globals.css';

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const { isLoginOpen, closeLogin, loginSuccess } = useAuth();

  useEffect(() => {
    // Auto-open briefing modal on first visit in session
    try {
      const hasDismissed = sessionStorage.getItem('acme_briefing_dismissed');
      if (!hasDismissed) {
        setIsBriefingOpen(true);
      }
    } catch (e) {
      setIsBriefingOpen(true);
    }

    // Background warm-up ping to backend health check
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    fetch(`${baseUrl}/health`, { cache: 'no-store' }).catch(() => {
      // Silent catch: just warming up server instance
    });
  }, []);

  const handleCloseBriefing = () => {
    setIsBriefingOpen(false);
    try {
      sessionStorage.setItem('acme_briefing_dismissed', 'true');
    } catch (e) {
      // Ignore
    }
  };

  return (
    <>
      <Header onOpenBriefing={() => setIsBriefingOpen(true)} />

      {children}

      <footer className="global-footer">
        <p>© {new Date().getFullYear()} ACME Organization. Global Employee Compensation & HR Intelligence System.</p>
      </footer>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeLogin}
        onSuccess={loginSuccess}
      />

      <WelcomeBriefingModal
        isOpen={isBriefingOpen}
        onClose={handleCloseBriefing}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>ACME Organization – Salary Management Platform</title>
        <meta name="description" content="Enterprise employee salary management and HR compensation analytics software for 10,000+ staff." />
      </head>
      <body>
        <AuthProvider>
          <MainLayoutContent>{children}</MainLayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
