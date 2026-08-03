'use client';

import React, { useRef } from 'react';

type EventCard = {
  id: number;
  date: string;
  month: string;
  title: string;
  category: string;
  location: string;
  description: string;
};

const EVENTS: EventCard[] = [
  {
    id: 1,
    date: '15',
    month: 'AUG',
    title: 'Global Mid-Month Payroll Pre-Clearance',
    category: 'Payroll Schedule',
    location: 'All 6 Regions (US, UK, IN, DE, JP, CA)',
    description: 'Pre-clearance file validation for 10,000 employee direct bank deposits.',
  },
  {
    id: 2,
    date: '22',
    month: 'AUG',
    title: 'Q3 Executive Salary Band & Compensation Audit',
    category: 'Compliance Audit',
    location: 'ACME Headquarters & Global HR',
    description: 'Annual pay equity and salary band review across engineering and product departments.',
  },
  {
    id: 3,
    date: '31',
    month: 'AUG',
    title: 'End of Month Salary Release & Tax Filing',
    category: 'Payroll Release',
    location: 'Global Banking Operations',
    description: 'Final execution of August payroll release and regional tax withholding disbursements.',
  },
  {
    id: 4,
    date: '05',
    month: 'SEP',
    title: 'ACME Global Employee Townhall & All-Hands',
    category: 'Company Event',
    location: 'Virtual Event / All Offices',
    description: 'Quarterly organization update presented by executive leadership.',
  },
  {
    id: 5,
    date: '12',
    month: 'SEP',
    title: 'Germany & UK Benefits Open Enrollment Window',
    category: 'Benefits Admin',
    location: 'Europe HR Division',
    description: 'Annual pension and healthcare plan enrollment window for European employees.',
  },
];

export default function EventsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="feature-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F4C5C', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📅</span> Upcoming Organizational Events & Payroll Deadlines
          </h3>
          <p style={{ fontSize: '0.825rem', color: '#5C5C5C', marginTop: '0.15rem' }}>
            Scroll horizontally to view upcoming global payroll release dates and compliance milestones.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => scroll('left')}
            className="auth-btn auth-btn-outline"
            style={{ padding: '0.35rem 0.65rem', borderRadius: '50%' }}
            title="Scroll Left"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="auth-btn auth-btn-outline"
            style={{ padding: '0.35rem 0.65rem', borderRadius: '50%' }}
            title="Scroll Right"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '1rem',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          paddingBottom: '0.5rem',
        }}
      >
        {EVENTS.map((event) => (
          <div
            key={event.id}
            style={{
              minWidth: '290px',
              maxWidth: '290px',
              background: '#ffffff',
              border: '1px solid #E5E2DC',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div
                  style={{
                    background: '#0F4C5C',
                    color: '#ffffff',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    minWidth: '46px',
                  }}
                >
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1 }}>{event.date}</div>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{event.month}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1D8A7A', textTransform: 'uppercase' }}>
                    {event.category}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>📍 {event.location}</div>
                </div>
              </div>

              <h4 style={{ fontSize: '0.925rem', fontWeight: 600, color: '#1A1A1A', marginBottom: '0.4rem' }}>
                {event.title}
              </h4>
              <p style={{ fontSize: '0.825rem', color: '#5C5C5C', margin: 0, lineHeight: 1.4 }}>
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
