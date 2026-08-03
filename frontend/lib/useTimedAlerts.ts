'use client';

import { useEffect, useState } from 'react';

export type ToastAlert = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: string;
};

export function useTimedAlerts(onNewEvent?: () => void) {
  const [toasts, setToasts] = useState<ToastAlert[]>([]);

  const addToast = (title: string, message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    const newToast: ToastAlert = {
      id: `${Date.now()}-${Math.random()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setToasts((prev) => [newToast, ...prev].slice(0, 4));
    if (onNewEvent) onNewEvent();
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    // 15 Seconds: Low-Priority Expense Claim
    const timer15 = setTimeout(() => {
      addToast(
        '🔔 New Reimbursement Request Received',
        'Sales Representative EMP-09281 submitted $840 travel claim for review.',
        'info'
      );
    }, 15000);

    // 45 Seconds: Compliance Alert
    const timer45 = setTimeout(() => {
      addToast(
        '⚠️ Tax Compliance Filing Reminder',
        'Germany office Q3 pension contribution & tax filing is due in 3 days.',
        'warning'
      );
    }, 45000);

    // 75 Seconds (1.2 Min): Onboarding Request
    const timer75 = setTimeout(() => {
      addToast(
        '📋 New Hire Onboarding Request',
        'Senior Software Architect onboarding offer submitted for HR signature.',
        'info'
      );
    }, 75000);

    // 180 Seconds (3 Min): Security Audit Notification
    const timer180 = setTimeout(() => {
      addToast(
        '✅ Annual Compensation Audit Complete',
        'Automated database audit completed: 0 security anomalies or pay band breaches found.',
        'success'
      );
    }, 180000);

    // 300 Seconds (5 Min): Pre-Clearance Done
    const timer300 = setTimeout(() => {
      addToast(
        '🏦 Global Payroll Pre-Clearance Complete',
        'All 10,000 employee bank account records pre-verified for monthly deposit release.',
        'success'
      );
    }, 300000);

    return () => {
      clearTimeout(timer15);
      clearTimeout(timer45);
      clearTimeout(timer75);
      clearTimeout(timer180);
      clearTimeout(timer300);
    };
  }, []);

  return { toasts, removeToast };
}
