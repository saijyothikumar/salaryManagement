'use client';

import React from 'react';
import BackButton from '../../components/BackButton';

export default function SupportPage() {
  const faqs = [
    {
      q: 'How are employee salaries recorded across global offices?',
      a: 'Salaries are recorded in local currency per region (USD for US, GBP for UK, INR for India, EUR for Germany, JPY for Japan, CAD for Canada).',
    },
    {
      q: 'Who has permission to update or add employee compensation records?',
      a: 'Only authorized HR Managers authenticated with JWT security credentials can edit salary levels, titles, or create new employee entries. Guest visitors have read-only access to directory records.',
    },
    {
      q: 'How frequently is employee salary data updated?',
      a: 'Database records update instantly upon submission by an HR Manager. Seeding and pagination queries are processed directly against the indexed SQLite engine.',
    },
    {
      q: 'How do I submit feedback or report system issues?',
      a: 'You can contact the developer directly via the email link below.',
    },
  ];

  return (
    <main className="dashboard-container">
      <BackButton />

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0F4C5C' }}>
          System Support & Frequently Asked Questions
        </h1>
        <p style={{ color: '#5C5C5C', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Technical answers and developer contact information for the Salary Platform.
        </p>
      </div>

      {/* FAQ Grid */}
      <div className="features-grid" style={{ marginBottom: '2.5rem' }}>
        {faqs.map((faq, idx) => (
          <div key={idx} className="feature-card">
            <h3 className="feature-title" style={{ fontSize: '1.05rem', color: '#0F4C5C' }}>
              {faq.q}
            </h3>
            <p className="feature-desc" style={{ fontSize: '0.875rem' }}>
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      {/* Contact / Feedback Card */}
      <div
        className="feature-card"
        style={{
          background: '#ffffff',
          border: '1px solid #E5E2DC',
          borderRadius: '16px',
          padding: '2.5rem',
          textAlign: 'center',
          maxWidth: '680px',
          margin: '0 auto',
        }}
      >
        <div style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>✉️</div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0F4C5C', marginBottom: '0.5rem' }}>
          Developer Contact & Support
        </h2>
        <p style={{ color: '#5C5C5C', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Have feedback or technical questions about this software? Reach out directly to the lead developer.
        </p>
        <a
          href="mailto:saikumarjyo14@gmail.com?subject=ACME%20Salary%20Management%20Platform%20Feedback"
          className="btn-hero-primary"
          style={{ display: 'inline-block' }}
        >
          Email Developer (saikumarjyo14@gmail.com)
        </a>
      </div>
    </main>
  );
}
