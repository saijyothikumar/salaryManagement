import logging
import math
from typing import Literal

from sqlalchemy import func, or_
from sqlmodel import Session, col, select

from app.models.employee import Employee
from app.schemas.employee_read import (
    CountrySalarySummary,
    DepartmentSalarySummary,
    HRAnalyticsResponse,
    PaginatedEmployeeResponse,
)

logger = logging.getLogger("salary_management.service")

ALLOWED_SORT_FIELDS = {
    "id": Employee.id,
    "employee_code": Employee.employee_code,
    "first_name": Employee.first_name,
    "last_name": Employee.last_name,
    "department": Employee.department,
    "country": Employee.country,
    "job_title": Employee.job_title,
    "base_salary": Employee.base_salary,
    "joined_at": Employee.joined_at,
    "status": Employee.status,
}


def get_paginated_employees(
    session: Session,
    page: int = 1,
    page_size: int = 20,
    search: str | None = None,
    department: str | None = None,
    country: str | None = None,
    status: str | None = None,
    sort_by: str = "id",
    sort_order: Literal["asc", "desc"] = "asc",
) -> PaginatedEmployeeResponse:
    # Ensure page parameters are positive
    page = max(1, page)
    page_size = max(1, min(100, page_size))

    # Base query construction
    statement = select(Employee)

    # Dynamic filter conditions
    filters = []
    if search:
        search_term = f"%{search.strip()}%"
        filters.append(
            or_(
                col(Employee.first_name).ilike(search_term),
                col(Employee.last_name).ilike(search_term),
                col(Employee.email).ilike(search_term),
                col(Employee.employee_code).ilike(search_term),
            )
        )
    if department:
        filters.append(Employee.department == department)
    if country:
        filters.append(Employee.country == country)
    if status:
        filters.append(Employee.status == status)

    if filters:
        statement = statement.where(*filters)

    # Count total matching rows efficiently
    count_statement = select(func.count()).select_from(statement.subquery())
    total = session.exec(count_statement).one()

    # Sort field resolution
    sort_column = ALLOWED_SORT_FIELDS.get(sort_by, Employee.id)
    if sort_order == "desc":
        statement = statement.order_by(col(sort_column).desc())
    else:
        statement = statement.order_by(col(sort_column).asc())

    # Apply pagination offset and limit
    offset = (page - 1) * page_size
    statement = statement.offset(offset).limit(page_size)

    items = session.exec(statement).all()
    total_pages = math.ceil(total / page_size) if total > 0 else 1

    logger.info(
        f"Fetched page {page}/{total_pages} ({len(items)} items, total: {total}) "
        f"[search='{search}', dept='{department}', country='{country}', status='{status}']"
    )

    return PaginatedEmployeeResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


def get_hr_analytics(session: Session) -> HRAnalyticsResponse:
    # Total headcount
    total_employees = session.exec(select(func.count(Employee.id))).one()

    # Active headcount
    active_employees = session.exec(
        select(func.count(Employee.id)).where(Employee.status == "active")
    ).one()

    # Department breakdown
    dept_stmt = select(
        Employee.department,
        func.count(Employee.id).label("count"),
        func.avg(Employee.base_salary).label("avg_salary"),
    ).group_by(Employee.department)
    dept_rows = session.exec(dept_stmt).all()

    dept_summaries = [
        DepartmentSalarySummary(
            department=row[0],
            employee_count=row[1],
            avg_salary=round(row[2] or 0.0, 2),
        )
        for row in dept_rows
    ]

    # Country breakdown
    country_stmt = select(
        Employee.country,
        Employee.currency,
        func.count(Employee.id).label("count"),
        func.avg(Employee.base_salary).label("avg_salary"),
    ).group_by(Employee.country, Employee.currency)
    country_rows = session.exec(country_stmt).all()

    country_summaries = [
        CountrySalarySummary(
            country=row[0],
            currency=row[1],
            employee_count=row[2],
            avg_salary=round(row[3] or 0.0, 2),
        )
        for row in country_rows
    ]

    logger.info("Generated HR salary analytics dashboard metrics.")

    return HRAnalyticsResponse(
        total_employees=total_employees,
        active_employees=active_employees,
        departments=dept_summaries,
        countries=country_summaries,
    )
