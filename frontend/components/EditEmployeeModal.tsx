'use client';

import React, { useEffect, useState } from 'react';
import { Employee, updateEmployee } from '../lib/api';

type EditEmployeeModalProps = {
  employee: Employee | null;
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

export default function EditEmployeeModal({
  employee,
  token,
  onClose,
  onSuccess,
}: EditEmployeeModalProps) {
  const [baseSalary, setBaseSalary] = useState<number>(0);
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('active');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (employee) {
      setBaseSalary(employee.base_salary);
      setJobTitle(employee.job_title);
      setDepartment(employee.department);
      setStatus(employee.status);
    }
  }, [employee]);

  if (!employee) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('HR Authentication Token missing. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await updateEmployee(
        employee.id,
        {
          base_salary: Number(baseSalary),
          job_title: jobTitle,
          department,
          status,
        },
        token
      );
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update employee details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">Edit Employee Compensation</h2>
          <button type="button" onClick={onClose} className="modal-close">
            ✕
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: '#5C5C5C', marginBottom: '1.25rem' }}>
          Updating records for <strong>{employee.first_name} {employee.last_name}</strong> ({employee.employee_code})
        </p>

        {error && (
          <div style={{ padding: '0.75rem', background: '#fdf0ed', border: '1px solid #f8c9be', color: '#b84328', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="edit-salary">Base Salary ({employee.currency})</label>
            <input
              id="edit-salary"
              type="number"
              value={baseSalary}
              onChange={(e) => setBaseSalary(Number(e.target.value))}
              className="form-input"
              step="500"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-title">Job Title</label>
            <input
              id="edit-title"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-department">Department</label>
            <select
              id="edit-department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="form-input"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-status">Employment Status</label>
            <select
              id="edit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-input"
            >
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="auth-btn auth-btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="auth-btn auth-btn-primary">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
