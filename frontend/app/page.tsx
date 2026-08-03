'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import AnomaliesBanner from '../components/AnomaliesBanner';
import ApprovalsQueue from '../components/ApprovalsQueue';
import EventsCarousel from '../components/EventsCarousel';
import HighPriorityMails from '../components/HighPriorityMails';
import TeamTaskBoard from '../components/TeamTaskBoard';
import ToastContainer from '../components/ToastContainer';
import { useAuth } from '../lib/AuthContext';
import { useTimedAlerts } from '../lib/useTimedAlerts';
import {
  WorkflowOverviewResponse,
  fetchWorkflowOverview,
} from '../lib/api';

export default function HomePage() {
  const { user, token, isHRManager } = useAuth();
  const [overview, setOverview] = useState<WorkflowOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWorkflowOverview();
      setOverview(data);
    } catch (err) {
      console.error('Failed to load workflow overview:', err);
      setError('Unable to fetch workflow data. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  // Hook triggering timed simulation alerts at 15s, 45s, 1.2m, 3m, and 5m
  const { toasts, removeToast } = useTimedAlerts(loadOverview);

  return (
    <main className="dashboard-container">
      {/* Toast Alert Container for Simulated Real-Time Events */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Header Banner - Compact Executive Overview */}
      <section className="hero-section" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="hero-pill" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
              HR Operations Command Center
            </span>
            <h1 className="hero-title" style={{ fontSize: '1.65rem', marginTop: '0.35rem' }}>
              Today&apos;s Focus & Operational Status
            </h1>
            <p className="hero-subtext" style={{ maxWidth: '640px', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Executive action center for 10,000 global employee records, pending approvals, regional deposit clearing, and HR specialist team workloads.
            </p>
          </div>

          <div className="hero-actions" style={{ marginTop: 0 }}>
            <Link href="/directory" className="btn-hero-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>
              10,000 Staff Directory →
            </Link>
          </div>
        </div>
      </section>

      {/* Cash Liquidity & Executive Metrics Cards */}
      {overview && (
        <div className="stats-grid" style={{ marginBottom: '1.75rem' }}>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Pending HR Approvals</span>
              <span className="stat-icon">📑</span>
            </div>
            <div className="stat-value">{overview.total_pending_approvals}</div>
            <div className="stat-subtext">Onboarding & salary change queue</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Critical Regional Alerts</span>
              <span className="stat-icon">⚠️</span>
            </div>
            <div className="stat-value" style={{ color: overview.critical_anomalies_count > 0 ? '#E76F51' : '#0F4C5C' }}>
              {overview.critical_anomalies_count}
            </div>
            <div className="stat-subtext">Deposit lags & compliance flags</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Monthly Payroll Liability</span>
              <span className="stat-icon">💵</span>
            </div>
            <div className="stat-value font-mono">
              ${(overview.payroll_liquidity_usd / 1000000).toFixed(2)}M
            </div>
            <div className="stat-subtext">10,000 global employees total</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Available Cash Deposit Pool</span>
              <span className="stat-icon">🏦</span>
            </div>
            <div className="stat-value font-mono" style={{ color: '#1D8A7A' }}>
              ${(overview.available_cash_usd / 1000000).toFixed(2)}M
            </div>
            <div className="stat-subtext">Liquidity reserve coverage: 130%</div>
          </div>
        </div>
      )}

      {loading && (
        <div className="stat-card skeleton-card" style={{ marginBottom: '1.75rem' }}>
          Loading HR Command Center data...
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', background: '#fdf0ed', border: '1px solid #f8c9be', color: '#b84328', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Critical Region Anomalies & Deposit Lags Banner */}
      {overview && <AnomaliesBanner anomalies={overview.anomalies} />}

      {/* High-Priority Mails & Interactive Reader Modal */}
      <HighPriorityMails isHRManager={isHRManager} />

      {/* Pending Approvals Queue with Horizontal Scroll, Attachment Indicator & Mandatory Rejection Comment */}
      {overview && (
        <ApprovalsQueue
          approvals={overview.approvals}
          isHRManager={isHRManager}
          token={token || null}
          onRefresh={loadOverview}
        />
      )}

      {/* HR Team Specialist Workload (6 Members) */}
      {overview && <TeamTaskBoard tasks={overview.tasks} />}

      {/* Upcoming Company Events & Payroll Release Horizontal Carousel */}
      <EventsCarousel />
    </main>
  );
}