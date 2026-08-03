import React from 'react';
import { PayrollAnomaly } from '../lib/api';

type AnomaliesBannerProps = {
  anomalies: PayrollAnomaly[];
};

export default function AnomaliesBanner({ anomalies }: AnomaliesBannerProps) {
  if (!anomalies || anomalies.length === 0) return null;

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F4C5C', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>⚠️</span> Today&apos;s Critical Operations & Deposit Alerts
        </h3>
        <span style={{ fontSize: '0.8rem', color: '#5C5C5C' }}>
          {anomalies.length} active issue{anomalies.length > 1 ? 's' : ''} detected
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {anomalies.map((item) => {
          const isCritical = item.severity === 'critical';
          const bg = isCritical ? '#fdf0ed' : '#fffbeb';
          const border = isCritical ? '#f8c9be' : '#fef08a';
          const text = isCritical ? '#b84328' : '#92400e';
          const badgeBg = isCritical ? '#e76f51' : '#e9c46a';

          return (
            <div
              key={item.id}
              style={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    color: '#ffffff',
                    background: badgeBg,
                  }}
                >
                  {item.severity} • {item.region}
                </span>
                <span style={{ fontSize: '0.75rem', color: text }}>Region Alert</span>
              </div>

              {/* Title with hover tooltip */}
              <h4
                title={item.title}
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#1A1A1A',
                  margin: '0.25rem 0 0.35rem 0',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  cursor: 'help',
                }}
              >
                {item.title}
              </h4>

              {/* Description with hover tooltip */}
              <p
                title={item.description}
                style={{
                  fontSize: '0.825rem',
                  color: '#5C5C5C',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  cursor: 'help',
                }}
              >
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
