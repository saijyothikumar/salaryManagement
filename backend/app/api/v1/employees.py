from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session

from app.api.v1.auth import get_current_hr_user
from app.core.database import get_session
from app.models.employee import Employee
from app.models.user import User
from app.schemas.employee_read import EmployeeCreate, EmployeeRead, EmployeeUpdate, PaginatedEmployeeResponse
from app.services.employee_service import get_paginated_employees

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("", response_model=PaginatedEmployeeResponse)
def list_employees(
    page: int = Query(default=1, ge=1, description="Page number starting at 1"),
    page_size: int = Query(default=20, ge=1, le=100, description="Items per page"),
    search: str | None = Query(default=None, max_length=50, description="Search term for name/email/code"),
    department: str | None = Query(default=None, description="Filter by department"),
    country: str | None = Query(default=None, description="Filter by country"),
    status_filter: str | None = Query(default=None, alias="status", description="Filter by employment status"),
    min_salary: float | None = Query(default=None, ge=0, description="Minimum base salary filter"),
    max_salary: float | None = Query(default=None, ge=0, description="Maximum base salary filter"),
    sort_by: str = Query(default="id", description="Column to sort by"),
    sort_order: Literal["asc", "desc"] = Query(default="asc", description="Sort order asc or desc"),
    session: Session = Depends(get_session),
):
    """
    Get a paginated, searchable, and filterable list of organization employees (Public / Guest).
    """
    try:
        return get_paginated_employees(
            session=session,
            page=page,
            page_size=page_size,
            search=search,
            department=department,
            country=country,
            status=status_filter,
            min_salary=min_salary,
            max_salary=max_salary,
            sort_by=sort_by,
            sort_order=sort_order,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to query employees: {str(e)}")


@router.post("", response_model=EmployeeRead, status_code=status.HTTP_201_CREATED)
def create_employee(
    data: EmployeeCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_hr_user),
):
    """
    Create a new employee record.
    Protected endpoint: Requires valid HR Manager JWT Token.
    """
    try:
        employee = Employee.model_validate(data)
        session.add(employee)
        session.commit()
        session.refresh(employee)
        return employee
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to create employee record: {str(e)}")


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


@router.put("/{employee_id}", response_model=EmployeeRead)
def update_employee(
    employee_id: int,
    data: EmployeeUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_hr_user),
):
    """
    Update employee salary, title, department, or status.
    Protected endpoint: Requires valid HR Manager JWT Token.
    """
    employee = session.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(employee, key, value)

    session.add(employee)
    session.commit()
    session.refresh(employee)

    return employee
