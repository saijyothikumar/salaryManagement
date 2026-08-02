'use client';

import { useCallback, useEffect, useState } from 'react';
import EmployeeFilterBar from '../components/EmployeeFilterBar';
import EmployeeTable from '../components/EmployeeTable';
import Pagination from '../components/Pagination';
import SalaryStats from '../components/SalaryStats';
import {
  Employee,
  HRAnalyticsResponse,
  fetchEmployees,
  fetchHRAnalytics,
} from '../lib/api';

export default function DashboardPage() {
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

  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search Debounce (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to page 1 on new search
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  // Load Analytics Data
  useEffect(() => {
    async function loadAnalytics() {
      try {
        setAnalyticsLoading(true);
        const data = await fetchHRAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load HR analytics:', err);
      } finally {
        setAnalyticsLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  // Load Employees Data
  const loadEmployeeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEmployees({
        page,
        page_size: pageSize,
        search: debouncedSearch,
        department,
        country,
        status,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      setEmployees(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error(err);
      setError('Unable to fetch employee salary records. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, department, country, status, sortBy, sortOrder]);

  useEffect(() => {
    loadEmployeeData();
  }, [loadEmployeeData]);

  // Handle Sort Toggle
  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
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
    setSortBy('id');
    setSortOrder('asc');
    setPage(1);
  };

  return (
    <main className="dashboard-container">
      {/* Header Bar */}
      <header className="header-bar">
        <div className="title-group">
          <h1>ACME Employee Salary Directory</h1>
          <p>Web-based compensation reporting & global salary management for 10,000+ staff.</p>
        </div>
        <div className="header-actions">
          <span className="badge-org">ACME Organization • Global HR</span>
        </div>
      </header>

      {/* Analytics Metric Cards */}
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
        onReset={handleResetFilters}
      />

      {error && (
        <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '8px', marginBottom: '1rem' }}>
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
    </main>
  );
}