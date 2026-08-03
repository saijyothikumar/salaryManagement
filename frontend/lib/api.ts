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
  min_salary?: number;
  max_salary?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
};

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  role: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
  user: AuthUser;
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
  if (params.min_salary !== undefined && !isNaN(params.min_salary)) query.append('min_salary', params.min_salary.toString());
  if (params.max_salary !== undefined && !isNaN(params.max_salary)) query.append('max_salary', params.max_salary.toString());
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

export async function loginHR(username: string, password: string): Promise<TokenResponse> {
  const url = `${BASE_URL}/api/v1/auth/login`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Authentication failed' }));
    throw new Error(errorData.detail || 'Invalid credentials');
  }

  return res.json();
}

export async function updateEmployee(
  id: number,
  data: Partial<Pick<Employee, 'base_salary' | 'job_title' | 'department' | 'status'>>,
  token: string
): Promise<Employee> {
  const url = `${BASE_URL}/api/v1/employees/${id}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Failed to update employee' }));
    throw new Error(errorData.detail || 'Update operation unauthorized or failed.');
  }

  return res.json();
}

export async function createEmployee(
  data: Omit<Employee, 'id'>,
  token: string
): Promise<Employee> {
  const url = `${BASE_URL}/api/v1/employees`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Failed to create employee record' }));
    throw new Error(errorData.detail || 'Creation operation unauthorized or failed.');
  }

  return res.json();
}
