'use client';

import React, { useEffect, useState } from 'react';

type WelcomeBriefingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function WelcomeBriefingModal({ isOpen, onClose }: WelcomeBriefingModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 76, 92, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '100%',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <span className="hero-pill" style={{ background: '#e6f4f1', color: '#0F4C5C', borderColor: '#b2dfd5', marginBottom: '0.4rem', display: 'inline-block' }}>
              Daily Executive Briefing
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F4C5C' }}>
              Welcome, HR Manager 💡
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontSize: '1rem',
              color: '#64748b',
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ color: '#5C5C5C', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
          Here is your daily operational summary for managing ACME Organization&apos;s 10,000 employees across 6 global regions:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', background: '#F7F6F3', padding: '0.85rem', borderRadius: '10px' }}>
            <span style={{ fontSize: '1.25rem' }}>📑</span>
            <div>
              <strong style={{ fontSize: '0.9rem', color: '#1A1A1A', display: 'block' }}>
                Pending Approvals Queue
              </strong>
              <span style={{ fontSize: '0.825rem', color: '#5C5C5C' }}>
                Review and approve/reject pending onboarding offers, salary advances, and reimbursement claims.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', background: '#F7F6F3', padding: '0.85rem', borderRadius: '10px' }}>
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <div>
              <strong style={{ fontSize: '0.9rem', color: '#1A1A1A', display: 'block' }}>
                Regional Alerts & Deposit Clearing
              </strong>
              <span style={{ fontSize: '0.825rem', color: '#5C5C5C' }}>
                Track banking clearing lags in Tokyo office and UK tax reference compliance codes.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', background: '#F7F6F3', padding: '0.85rem', borderRadius: '10px' }}>
            <span style={{ fontSize: '1.25rem' }}>👥</span>
            <div>
              <strong style={{ fontSize: '0.9rem', color: '#1A1A1A', display: 'block' }}>
                HR Team Specialist Allocation (6 Members)
              </strong>
              <span style={{ fontSize: '0.825rem', color: '#5C5C5C' }}>
                Monitor active tickets assigned to Sarah (Payroll), David (UK), Elena (Benefits), and regional leads.
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={onClose}
            className="auth-btn auth-btn-primary"
            style={{ padding: '0.6rem 1.5rem', width: '100%', textAlign: 'center' }}
          >
            Acknowledge & Open Command Center →
          </button>
        </div>
      </div>
    </div>
  );
}
