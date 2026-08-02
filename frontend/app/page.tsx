'use client';

import { useEffect, useState } from 'react';

type Employee = {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  department: string;
  job_title: string;
  base_salary: number;
  currency: string;
};

export default function HomePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEmployees() {
      try {
        const res = await fetch('http://127.0.0.1:8000/employees');
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load employees');
      } finally {
        setLoading(false);
      }
    }

    loadEmployees();
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Salary Management – Phase 1 Skeleton</h1>

      {loading ? (
        <p>Loading employees...</p>
      ) : employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <div className="table-shell">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Department</th>
                <th>Title</th>
                <th>Salary</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.employee_code}</td>
                  <td>{employee.first_name} {employee.last_name}</td>
                  <td>{employee.department}</td>
                  <td>{employee.job_title}</td>
                  <td>{employee.currency} {employee.base_salary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}