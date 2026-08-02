from datetime import date, datetime

from sqlmodel import Field, SQLModel


class Employee(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    employee_code: str = Field(index=True, unique=True)
    first_name: str
    last_name: str
    email: str = Field(unique=True)
    department: str
    country: str
    job_title: str
    base_salary: float
    currency: str = Field(default="USD")
    status: str = Field(default="active")
    joined_at: date
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
