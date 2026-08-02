import React from 'react';
import { HRAnalyticsResponse } from '../lib/api';

type SalaryStatsProps = {
  analytics: HRAnalyticsResponse | null;
  loading: boolean;
};

export default function SalaryStats({ analytics, loading }: SalaryStatsProps) {
  if (loading || !analytics) {
    return (
      <div className="stats-grid">
        <div className="stat-card skeleton-card">Loading HR Stats...</div>
        <div className="stat-card skeleton-card">Loading HR Stats...</div>
        <div className="stat-card skeleton-card">Loading HR Stats...</div>
        <div className="stat-card skeleton-card">Loading HR Stats...</div>
      </div>
    );
  }

  const topDept = analytics.departments.reduce((prev, current) => 
    (prev.avg_salary > current.avg_salary) ? prev : current, analytics.departments[0] || { department: 'N/A', avg_salary: 0 });

  const topCountry = analytics.countries.reduce((prev, current) => 
    (prev.avg_salary > current.avg_salary) ? prev : current, analytics.countries[0] || { country: 'N/A', currency: '', avg_salary: 0 });

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-label">Total Headcount</div>
        <div className="stat-value">{analytics.total_employees.toLocaleString()}</div>
        <div className="stat-subtext">Across {analytics.countries.length} Global Regions</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Active Workforce</div>
        <div className="stat-value text-emerald">{analytics.active_employees.toLocaleString()}</div>
        <div className="stat-subtext">
          {((analytics.active_employees / (analytics.total_employees || 1)) * 100).toFixed(1)}% Operational Capacity
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Top Paying Department</div>
        <div className="stat-value">{topDept.department}</div>
        <div className="stat-subtext">Avg Pay: ${topDept.avg_salary.toLocaleString()}</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Top Paying Country</div>
        <div className="stat-value">{topCountry.country}</div>
        <div className="stat-subtext">Avg Pay: {topCountry.currency} {topCountry.avg_salary.toLocaleString()}</div>
      </div>
    </div>
  );
}
