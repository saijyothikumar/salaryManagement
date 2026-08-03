'use client';

import React, { useCallback, useEffect, useState } from 'react';
import AddEmployeeModal from '../../components/AddEmployeeModal';
import BackButton from '../../components/BackButton';
import EditEmployeeModal from '../../components/EditEmployeeModal';
import EmployeeFilterBar from '../../components/EmployeeFilterBar';
import EmployeeTable from '../../components/EmployeeTable';
import Pagination from '../../components/Pagination';
import SalaryStats from '../../components/SalaryStats';
import WorkforceCharts from '../../components/WorkforceCharts';
import { useAuth } from '../../lib/AuthContext';
import {
  Employee,
  HRAnalyticsResponse,
  fetchEmployees,
  fetchHRAnalytics,
} from '../../lib/api';

export default function DirectoryPage() {
  const { token, isHRManager } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [analytics, setAnalytics] = useState<HRAnalyticsResponse | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');

  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Search Debounce (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  // Load Analytics Data
  const loadAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true);
      const data = await fetchHRAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load HR analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Load Employees Data
  const loadEmployeeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const minSalNum = minSalary ? Number(minSalary) : undefined;
      const maxSalNum = maxSalary ? Number(maxSalary) : undefined;

      const data = await fetchEmployees({
        page,
        page_size: pageSize,
        search: debouncedSearch,
        department,
        country,
        status,
        min_salary: minSalNum,
        max_salary: maxSalNum,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      setEmployees(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error(err);
      setError('Unable to fetch employee records. Ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, department, country, status, minSalary, maxSalary, sortBy, sortOrder]);

  useEffect(() => {
    loadEmployeeData();
  }, [loadEmployeeData]);

  // 3-Way Column Sorting Cycle: asc -> desc -> reset default ('id')
  const handleSortChange = (column: string) => {
    if (sortBy !== column) {
      setSortBy(column);
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      // 3rd click: Reset to default sort by id asc
      setSortBy('id');
      setSortOrder('asc');
    }
    setPage(1);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setDepartment('');
    setCountry('');
    setStatus('');
    setMinSalary('');
    setMaxSalary('');
    setSortBy('id');
    setSortOrder('asc');
    setPage(1);
  };

  return (
    <main className="dashboard-container">
      {/* Back to Command Center Navigation */}
      <BackButton />

      {/* Page Heading */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0F4C5C' }}>
            Employee Directory & Salary Records
          </h1>
          <p style={{ color: '#5C5C5C', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            {isHRManager
              ? 'HR Manager Mode — Full View, Edit, and Create rights enabled.'
              : 'Guest Mode — Public read-only browsing.'}
          </p>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <WorkforceCharts analytics={analytics} loading={analyticsLoading} />

      {/* Metrics Header */}
      <SalaryStats analytics={analytics} loading={analyticsLoading} />

      {/* Filter Toolbar */}
      <EmployeeFilterBar
        search={search}
        onSearchChange={setSearch}
        department={department}
        onDepartmentChange={(val) => { setDepartment(val); setPage(1); }}
        country={country}
        onCountryChange={(val) => { setCountry(val); setPage(1); }}
        status={status}
        onStatusChange={(val) => { setStatus(val); setPage(1); }}
        minSalary={minSalary}
        onMinSalaryChange={(val) => { setMinSalary(val); setPage(1); }}
        maxSalary={maxSalary}
        onMaxSalaryChange={(val) => { setMaxSalary(val); setPage(1); }}
        onReset={handleResetFilters}
        isHRManager={isHRManager}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {error && (
        <div style={{ padding: '1rem', background: '#fdf0ed', border: '1px solid #f8c9be', color: '#b84328', borderRadius: '8px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Employee Data Table */}
      <EmployeeTable
        employees={employees}
        loading={loading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        isHRManager={isHRManager}
        onEditEmployee={(emp) => setEditingEmployee(emp)}
      />

      {/* Pagination Bar */}
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newPageSize) => { setPageSize(newPageSize); setPage(1); }}
      />

      {/* Edit Compensation Modal */}
      <EditEmployeeModal
        employee={editingEmployee}
        token={token || null}
        onClose={() => setEditingEmployee(null)}
        onSuccess={() => {
          loadEmployeeData();
          loadAnalytics();
        }}
      />

      {/* Add New Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        token={token || null}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          loadEmployeeData();
          loadAnalytics();
        }}
      />
    </main>
  );
}
