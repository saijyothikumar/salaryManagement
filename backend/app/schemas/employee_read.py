from datetime import date, datetime
from sqlmodel import SQLModel


class EmployeeRead(SQLModel):
    id: int
    employee_code: str
    first_name: str
    last_name: str
    email: str
    department: str
    country: str
    job_title: str
    base_salary: float
    currency: str
    status: str
    joined_at: date
    created_at: datetime | None = None

class EmployeeUpdate(SQLModel):
    base_salary: float | None = None
    job_title: str | None = None
    department: str | None = None
    status: str | None = None


class EmployeeCreate(SQLModel):
    employee_code: str
    first_name: str
    last_name: str
    email: str
    department: str
    country: str
    job_title: str
    base_salary: float
    currency: str = "USD"
    status: str = "active"
    joined_at: date


class PaginatedEmployeeResponse(SQLModel):
    items: list[EmployeeRead]
    total: int
    page: int
    page_size: int
    total_pages: int


class DepartmentSalarySummary(SQLModel):
    department: str
    employee_count: int
    avg_salary: float


class CountrySalarySummary(SQLModel):
    country: str
    currency: str
    employee_count: int
    avg_salary: float


class HRAnalyticsResponse(SQLModel):
    total_employees: int
    active_employees: int
    departments: list[DepartmentSalarySummary]
    countries: list[CountrySalarySummary]