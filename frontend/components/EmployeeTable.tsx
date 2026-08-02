import React from 'react';
import { Employee } from '../lib/api';

type TableProps = {
  employees: Employee[];
  loading: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (column: string) => void;
};

export default function EmployeeTable({
  employees,
  loading,
  sortBy,
  sortOrder,
  onSortChange,
}: TableProps) {
  const renderSortIndicator = (column: string) => {
    if (sortBy !== column) return <span className="sort-icon sort-inactive">↕</span>;
    return <span className="sort-icon sort-active">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  const formatSalary = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${currency} ${amount.toLocaleString()}`;
    }
  };

  return (
    <div className="table-container">
      <div className="table-shell">
        <table className="employee-table">
          <thead>
            <tr>
              <th onClick={() => onSortChange('employee_code')} className="sortable-th">
                Code {renderSortIndicator('employee_code')}
              </th>
              <th onClick={() => onSortChange('first_name')} className="sortable-th">
                Employee Name {renderSortIndicator('first_name')}
              </th>
              <th onClick={() => onSortChange('department')} className="sortable-th">
                Department {renderSortIndicator('department')}
              </th>
              <th onClick={() => onSortChange('country')} className="sortable-th">
                Country {renderSortIndicator('country')}
              </th>
              <th onClick={() => onSortChange('job_title')} className="sortable-th">
                Job Title {renderSortIndicator('job_title')}
              </th>
              <th onClick={() => onSortChange('base_salary')} className="sortable-th text-right">
                Base Salary {renderSortIndicator('base_salary')}
              </th>
              <th onClick={() => onSortChange('status')} className="sortable-th">
                Status {renderSortIndicator('status')}
              </th>
              <th onClick={() => onSortChange('joined_at')} className="sortable-th">
                Joined Date {renderSortIndicator('joined_at')}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="empty-cell">
                  <div className="loader-box">
                    <img
                      src="/loader.gif"
                      alt="Loading..."
                      className="loader-img"
                      onError={(e) => {
                        // Fallback to CSS spinner if custom GIF is missing
                        (e.target as HTMLElement).style.display = 'none';
                        const parent = (e.target as HTMLElement).parentElement;
                        if (parent && !parent.querySelector('.spinner-fallback')) {
                          const spinner = document.createElement('div');
                          spinner.className = 'spinner-fallback';
                          parent.appendChild(spinner);
                        }
                      }}
                    />
                    <span className="loader-text">Loading employee salary records...</span>
                  </div>
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-cell">
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
