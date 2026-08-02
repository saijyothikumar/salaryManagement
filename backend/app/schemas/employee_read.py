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
    updated_at: datetime | None = None