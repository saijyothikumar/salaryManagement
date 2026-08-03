import React from 'react';
import { HRAnalyticsResponse } from '../lib/api';

type ChartsProps = {
  analytics: HRAnalyticsResponse | null;
  loading: boolean;
};

const COUNTRY_COLORS: Record<string, string> = {
  US: '#0F4C5C',
  UK: '#1D8A7A',
  India: '#E9C46A',
  Germany: '#264653',
  Japan: '#E76F51',
  Canada: '#457b9d',
};

export default function WorkforceCharts({ analytics, loading }: ChartsProps) {
  if (loading || !analytics) {
    return (
      <div className="features-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card skeleton-card">Loading charts...</div>
        <div className="stat-card skeleton-card">Loading charts...</div>
      </div>
    );
  }

  // Country Distribution Donut Chart calculation
  const totalEmps = analytics.total_employees || 1;
  let cumulativeAngle = 0;

  const countrySlices = analytics.countries.map((c) => {
    const percentage = c.employee_count / totalEmps;
    const angle = percentage * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;

    const x1 = 50 + 40 * Math.cos((Math.PI * (startAngle - 90)) / 180);
    const y1 = 50 + 40 * Math.sin((Math.PI * (startAngle - 90)) / 180);
    const x2 = 50 + 40 * Math.cos((Math.PI * (cumulativeAngle - 90)) / 180);
    const y2 = 50 + 40 * Math.sin((Math.PI * (cumulativeAngle - 90)) / 180);
    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = angle >= 359.9
      ? 'M 50 10 A 40 40 0 1 1 49.99 10 Z'
      : `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    return {
      country: c.country,
      count: c.employee_count,
      percentage: (percentage * 100).toFixed(1),
      color: COUNTRY_COLORS[c.country] || '#64748b',
      pathData,
    };
  });

  // Department Max Calculation for Bar Scale
  const maxDeptCount = Math.max(...analytics.departments.map((d) => d.employee_count), 1);

  return (
    <div className="features-grid" style={{ marginBottom: '2rem' }}>
      {/* Donut Chart Card */}
      <div className="feature-card" style={{ padding: '1.5rem' }}>
        <h3 className="feature-title" style={{ fontSize: '1.05rem', color: '#0F4C5C', marginBottom: '1rem' }}>
          Workforce Distribution by Country
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <svg viewBox="0 0 100 100" style={{ width: '130px', height: '130px', transform: 'rotate(0deg)' }}>
            {countrySlices.map((slice, idx) => (
              <path key={idx} d={slice.pathData} fill={slice.color} stroke="#ffffff" strokeWidth="1" />
            ))}
            <circle cx="50" cy="50" r="22" fill="#ffffff" />
          </svg>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
            {countrySlices.map((slice, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: slice.color }} />
                  <span>{slice.country}</span>
                </div>
                <span className="font-mono text-secondary">{slice.count.toLocaleString()} ({slice.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Breakdown Bar Chart */}
      <div className="feature-card" style={{ padding: '1.5rem' }}>
        <h3 className="feature-title" style={{ fontSize: '1.05rem', color: '#0F4C5C', marginBottom: '1rem' }}>
          Department Headcount Allocation
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {analytics.departments.map((dept, idx) => {
            const barWidthPercent = Math.round((dept.employee_count / maxDeptCount) * 100);
            return (
              <div key={idx} style={{ fontSize: '0.825rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span className="font-medium">{dept.department}</span>
                  <span className="font-mono text-secondary">{dept.employee_count.toLocaleString()} staff</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#E5E2DC', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${barWidthPercent}%`, height: '100%', background: '#0F4C5C', borderRadius: '4px' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
