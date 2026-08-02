from datetime import date, datetime, timezone

from sqlalchemy import Column, DateTime, Index, func
from sqlmodel import Field, SQLModel


def get_utc_now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Employee(SQLModel, table=True):
    __table_args__ = (
        Index("idx_dept_country_status", "department", "country", "status"),
    )

    id: int | None = Field(default=None, primary_key=True)
    employee_code: str = Field(index=True, unique=True)
    first_name: str
    last_name: str
    email: str = Field(unique=True)
    department: str = Field(index=True)
    country: str = Field(index=True)
    job_title: str
    base_salary: float = Field(index=True)
    currency: str = Field(default="USD")
    status: str = Field(default="active", index=True)
    joined_at: date

    created_at: datetime = Field(
        default_factory=get_utc_now,
        sa_column=Column(
            DateTime,
            nullable=False,
            server_default=func.now(),
        ),
    )
    updated_at: datetime = Field(
        default_factory=get_utc_now,
        sa_column=Column(
            DateTime,
            nullable=False,
            server_default=func.now(),
            onupdate=func.now(),
        ),
    )