from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.core.database import get_session
from app.models.employee import Employee
from app.schemas.employee_read import EmployeeRead, PaginatedEmployeeResponse
from app.services.employee_service import get_paginated_employees

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("", response_model=PaginatedEmployeeResponse)
def list_employees(
    page: int = Query(default=1, ge=1, description="Page number starting at 1"),
    page_size: int = Query(default=20, ge=1, le=100, description="Items per page"),
    search: str | None = Query(default=None, max_length=50, description="Search term for name/email/code"),
    department: str | None = Query(default=None, description="Filter by department"),
    country: str | None = Query(default=None, description="Filter by country"),
    status: str | None = Query(default=None, description="Filter by employment status"),
    sort_by: str = Query(default="id", description="Column to sort by"),
    sort_order: Literal["asc", "desc"] = Query(default="asc", description="Sort order asc or desc"),
    session: Session = Depends(get_session),
):
    """
    Get a paginated, searchable, and filterable list of organization employees.
    """
    try:
        return get_paginated_employees(
            session=session,
            page=page,
            page_size=page_size,
            search=search,
            department=department,
            country=country,
            status=status,
            sort_by=sort_by,
            sort_order=sort_order,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to query employees: {str(e)}")


@router.get("/{employee_id}", response_model=EmployeeRead)
def get_employee(
    employee_id: int,
    session: Session = Depends(get_session),
):
    """
    Get individual employee details by ID.
    """
    employee = session.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee
