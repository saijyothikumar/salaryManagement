import React from 'react';
import Image from 'next/image';
import { Employee } from '../lib/api';

type EmployeeTableProps = {
  employees: Employee[];
  loading: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (column: string) => void;
  isHRManager?: boolean;
  onEditEmployee?: (employee: Employee) => void;
};

export default function EmployeeTable({
  employees,
  loading,
  sortBy,
  sortOrder,
  onSortChange,
  isHRManager = false,
  onEditEmployee,
}: EmployeeTableProps) {
  const getSortIndicator = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  const formatSalary = (amount: number, currency: string) => {
    const symbols: Record<string, string> = {
      USD: '$',
      GBP: '£',
      INR: '₹',
      EUR: '€',
      JPY: '¥',
      CAD: 'CA$',
    };
    const symbol = symbols[currency] || '$';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const authTooltip = isHRManager
    ? 'Click to edit employee compensation'
    : 'Please log in as HR Manager to edit employee compensation';

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => onSortChange('employee_code')} className="sortable-th">
                Code{getSortIndicator('employee_code')}
              </th>
              <th onClick={() => onSortChange('first_name')} className="sortable-th">
                Name{getSortIndicator('first_name')}
              </th>
              <th onClick={() => onSortChange('department')} className="sortable-th">
                Department{getSortIndicator('department')}
              </th>
              <th onClick={() => onSortChange('country')} className="sortable-th">
                Country{getSortIndicator('country')}
              </th>
              <th onClick={() => onSortChange('job_title')} className="sortable-th">
                Job Title{getSortIndicator('job_title')}
              </th>
              <th onClick={() => onSortChange('base_salary')} className="sortable-th text-right">
                Base Salary{getSortIndicator('base_salary')}
              </th>
              <th onClick={() => onSortChange('status')} className="sortable-th">
                Status{getSortIndicator('status')}
              </th>
              <th onClick={() => onSortChange('joined_at')} className="sortable-th">
                Joined Date{getSortIndicator('joined_at')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="loading-cell">
                  <div className="table-loader-container">
                    <Image
                      src="/loader.gif"
                      alt="Loading..."
                      width={36}
                      height={36}
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="loader-text">Loading employee salary records...</span>
                  </div>
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={9} className="empty-cell">
                  No matching employees found for the selected criteria.
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee.id} className="table-row">
                  <td className="font-mono text-xs font-medium">{employee.employee_code}</td>
                  <td className="font-medium">{employee.first_name} {employee.last_name}</td>
                  <td>
                    <span className="badge badge-dept">{employee.department}</span>
                  </td>
                  <td>{employee.country}</td>
                  <td className="text-secondary">{employee.job_title}</td>
                  <td className="text-right font-medium font-mono">
                    {formatSalary(employee.base_salary, employee.currency)}
                  </td>
                  <td>
                    <span className={`badge badge-status-${employee.status}`}>
                      {employee.status === 'on_leave' ? 'On Leave' : employee.status}
                    </span>
                  </td>
                  <td className="text-secondary text-xs">{employee.joined_at}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => onEditEmployee?.(employee)}
                      disabled={!isHRManager}
                      title={authTooltip}
                      className="btn-edit-row"
                      style={{
                        opacity: isHRManager ? 1 : 0.65,
                        cursor: isHRManager ? 'pointer' : 'not-allowed',
                        background: isHRManager ? '#0F4C5C' : '#94a3b8',
                        borderColor: isHRManager ? '#0F4C5C' : '#94a3b8',
                        color: '#ffffff',
                      }}
                    >
                      {isHRManager ? 'Edit' : 'HR Auth Required'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
