import React from 'react';

type FilterBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  department: string;
  onDepartmentChange: (value: string) => void;
  country: string;
  onCountryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  minSalary: string;
  onMinSalaryChange: (value: string) => void;
  maxSalary: string;
  onMaxSalaryChange: (value: string) => void;
  onReset: () => void;
  isHRManager?: boolean;
  onOpenAddModal?: () => void;
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

const COUNTRIES = ['US', 'UK', 'India', 'Germany', 'Japan', 'Canada'];

const STATUSES = [
  { label: 'Active', value: 'active' },
  { label: 'On Leave', value: 'on_leave' },
  { label: 'Terminated', value: 'terminated' },
];

export default function EmployeeFilterBar({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  country,
  onCountryChange,
  status,
  onStatusChange,
  minSalary,
  onMinSalaryChange,
  maxSalary,
  onMaxSalaryChange,
  onReset,
  isHRManager = false,
  onOpenAddModal,
}: FilterBarProps) {
  const hasActiveFilters = search || department || country || status || minSalary || maxSalary;

  return (
    <div className="filter-bar">
      <div className="filter-group search-group">
        <label htmlFor="search-input" className="filter-label">Search</label>
        <input
          id="search-input"
          type="text"
          placeholder="Search name, email, code..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="department-select" className="filter-label">Department</label>
        <select
          id="department-select"
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="country-select" className="filter-label">Country</label>
        <select
          id="country-select"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All Countries</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="status-select" className="filter-label">Status</label>
        <select
          id="status-select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group" style={{ minWidth: '110px' }}>
        <label htmlFor="min-salary-input" className="filter-label">Min Pay</label>
        <input
          id="min-salary-input"
          type="number"
          placeholder="e.g. 50000"
          value={minSalary}
          onChange={(e) => onMinSalaryChange(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group" style={{ minWidth: '110px' }}>
        <label htmlFor="max-salary-input" className="filter-label">Max Pay</label>
        <input
          id="max-salary-input"
          type="number"
          placeholder="e.g. 150000"
          value={maxSalary}
          onChange={(e) => onMaxSalaryChange(e.target.value)}
          className="filter-input"
        />
      </div>

      {hasActiveFilters && (
        <div className="filter-group reset-group" style={{ minWidth: 'auto' }}>
          <button type="button" onClick={onReset} className="reset-btn">
            Reset Filters
          </button>
        </div>
      )}

      {isHRManager && (
        <div className="filter-group" style={{ minWidth: 'auto', marginLeft: 'auto' }}>
          <button type="button" onClick={onOpenAddModal} className="auth-btn auth-btn-primary">
            + Add Employee
          </button>
        </div>
      )}
    </div>
  );
}
