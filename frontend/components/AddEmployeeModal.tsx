'use client';

import React, { useState } from 'react';
import { createEmployee } from '../lib/api';

type AddEmployeeModalProps = {
  isOpen: boolean;
  token: string | null;
  onClose: () => void;
  onSuccess: () => void;
};

const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Human Resources',
  'Finance',
  'Sales',
  'Legal',
  'Operations',
  'Marketing',
];

const COUNTRY_CURRENCIES: Record<string, string> = {
  US: 'USD',
  UK: 'GBP',
  India: 'INR',
  Germany: 'EUR',
  Japan: 'JPY',
  Canada: 'CAD',
};

export default function AddEmployeeModal({
  isOpen,
  token,
  onClose,
  onSuccess,
}: AddEmployeeModalProps) {
  const [empCode, setEmpCode] = useState(`EMP-${Math.floor(10000 + Math.random() * 90000)}`);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [country, setCountry] = useState('US');
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [baseSalary, setBaseSalary] = useState(85000);
  const [status, setStatus] = useState('active');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('HR Authentication Token missing. Please log in.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const currency = COUNTRY_CURRENCIES[country] || 'USD';
      const todayStr = new Date().toISOString().split('T')[0];

      await createEmployee(
        {
          employee_code: empCode,
          first_name: firstName,
          last_name: lastName,
          email,
          department,
          country,
          job_title: jobTitle,
          base_salary: Number(baseSalary),
          currency,
          status,
          joined_at: todayStr,
        },
        token
      );

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create employee record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Add New Employee Record</h2>
          <button type="button" onClick={onClose} className="modal-close">
            ✕
          </button>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', background: '#fdf0ed', border: '1px solid #f8c9be', color: '#b84328', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="new-code">Employee Code</label>
              <input
                id="new-code"
                type="text"
                value={empCode}
                onChange={(e) => setEmpCode(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="new-status">Status</label>
              <select
                id="new-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-input"
              >
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="first-name">First Name</label>
              <input
                id="first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="last-name">Last Name</label>
              <input
                id="last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="new-email">Work Email</label>
            <input
              id="new-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="e.g. name@acme.org"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="new-dept">Department</label>
              <select
                id="new-dept"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="form-input"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="new-country">Country</label>
              <select
                id="new-country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="form-input"
              >
                {Object.keys(COUNTRY_CURRENCIES).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="new-title">Job Title</label>
              <input
                id="new-title"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="new-salary">Base Salary ({COUNTRY_CURRENCIES[country]})</label>
              <input
                id="new-salary"
                type="number"
                value={baseSalary}
                onChange={(e) => setBaseSalary(Number(e.target.value))}
                className="form-input"
                step="1000"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="auth-btn auth-btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="auth-btn auth-btn-primary">
              {loading ? 'Adding...' : 'Create Employee Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
