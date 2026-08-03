'use client';

import React from 'react';
import { ToastAlert } from '../lib/useTimedAlerts';

type ToastContainerProps = {
  toasts: ToastAlert[];
  onDismiss: (id: string) => void;
};

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        maxWidth: '360px',
        width: '100%',
      }}
    >
      {toasts.map((toast) => {
        const bg = toast.type === 'warning' ? '#fffbeb' : toast.type === 'success' ? '#f0fdf4' : '#f0f9ff';
        const border = toast.type === 'warning' ? '#fef08a' : toast.type === 'success' ? '#bbf7d0' : '#bae6fd';
        const text = toast.type === 'warning' ? '#92400e' : toast.type === 'success' ? '#166534' : '#0369a1';

        return (
          <div
            key={toast.id}
            style={{
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <strong style={{ fontSize: '0.85rem', color: text, display: 'block', marginBottom: '0.2rem' }}>
                {toast.title}
              </strong>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.85rem',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: 0,
                  marginLeft: '0.5rem',
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>
              {toast.message}
            </p>
            <span style={{ fontSize: '0.675rem', color: '#94a3b8', marginTop: '0.35rem', display: 'block' }}>
              Simulated Live Event • {toast.timestamp}
            </span>
          </div>
        );
      })}
    </div>
  );
}
