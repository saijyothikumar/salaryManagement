export type Employee = {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  country: string;
  job_title: string;
  base_salary: number;
  currency: string;
  status: 'active' | 'on_leave' | 'terminated' | string;
  joined_at: string;
};

export type PaginatedEmployeeResponse = {
  items: Employee[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
};

export type DepartmentSalarySummary = {
  department: string;
  employee_count: number;
  avg_salary: number;
};

export type CountrySalarySummary = {
  country: string;
  currency: string;
  employee_count: number;
  avg_salary: number;
};

export type HRAnalyticsResponse = {
  total_employees: number;
  active_employees: number;
  departments: DepartmentSalarySummary[];
  countries: CountrySalarySummary[];
};

export type EmployeeFilterParams = {
  page?: number;
  page_size?: number;
  search?: string;
  department?: string;
  country?: string;
  status?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function fetchEmployees(params: EmployeeFilterParams = {}): Promise<PaginatedEmployeeResponse> {
  const query = new URLSearchParams();

  if (params.page) query.append('page', params.page.toString());
  if (params.page_size) query.append('page_size', params.page_size.toString());
  if (params.search && params.search.trim() !== '') query.append('search', params.search.trim());
  if (params.department) query.append('department', params.department);
  if (params.country) query.append('country', params.country);
  if (params.status) query.append('status', params.status);
  if (params.sort_by) query.append('sort_by', params.sort_by);
  if (params.sort_order) query.append('sort_order', params.sort_order);

  const url = `${BASE_URL}/api/v1/employees?${query.toString()}`;

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(errorData.detail || `Server returned error status ${res.status}`);
    }

    return await res.json();
  } catch (err: unknown) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      console.error('[API Fetch Error] Failed to connect to backend server:', url);
      throw new Error(`Unable to connect to API server (${BASE_URL}). Please ensure the FastAPI backend is running.`);
    }
    console.error('[API Fetch Error]:', err);
    throw err instanceof Error ? err : new Error('An unexpected error occurred while fetching employee records.');
  }
}

export async function fetchHRAnalytics(): Promise<HRAnalyticsResponse> {
  const url = `${BASE_URL}/api/v1/analytics`;

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(errorData.detail || `Server returned error status ${res.status}`);
    }

    return await res.json();
  } catch (err: unknown) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      console.error('[API Analytics Error] Failed to connect to backend server:', url);
      throw new Error(`Unable to connect to API server (${BASE_URL}).`);
    }
    console.error('[API Analytics Error]:', err);
    throw err instanceof Error ? err : new Error('An unexpected error occurred while fetching analytics.');
  }
}
