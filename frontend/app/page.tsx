'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SalaryStats from '../components/SalaryStats';
import { HRAnalyticsResponse, fetchHRAnalytics } from '../lib/api';

export default function LandingPage() {
  const [analytics, setAnalytics] = useState<HRAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const data = await fetchHRAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load HR analytics on landing page:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  return (
    <main className="dashboard-container">
      {/* Hero Section */}
      <section className="hero-section">
        <span className="hero-pill">ACME Salary Management Platform</span>
        <h1 className="hero-title">Employee Compensation Directory & HR Analytics</h1>
        <p className="hero-subtext">
          Web-based salary directory for managing 10,000 employee records with fast searching, filtering, and role-based updates.
        </p>

        <div className="hero-actions">
          <Link href="/directory" className="btn-hero-primary">
            Open Employee Directory →
          </Link>
          <Link href="/support" className="btn-hero-secondary">
            Developer Support
          </Link>
        </div>
      </section>

      {/* Aggregate Organizational Salary Metrics */}
      <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0F4C5C', marginBottom: '1.25rem' }}>
        Workforce & Compensation Overview
      </h2>
      <SalaryStats analytics={analytics} loading={loading} />

      {/* Feature Cards Grid */}
      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📁</div>
          <h3 className="feature-title">10,000 Employee Directory</h3>
          <p className="feature-desc">
            Search, filter by department or region, and paginate through organization records cleanly.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3 className="feature-title">Fast Database Querying</h3>
          <p className="feature-desc">
            Indexed SQLite engine returning paginated employee rows and analytics metrics in sub-10ms response times.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔐</div>
          <h3 className="feature-title">HR Authentication</h3>
          <p className="feature-desc">
            Guest mode permits read-only directory search. Authenticated HR Managers unlock salary update and employee creation tools.
          </p>
        </div>
      </section>
    </main>
  );
}