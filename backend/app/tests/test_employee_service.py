import pytest
from datetime import date
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.models.employee import Employee
from app.services.employee_service import get_hr_analytics, get_paginated_employees


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        # Populate test records
        emp1 = Employee(
            employee_code="EMP-00001",
            first_name="John",
            last_name="Doe",
            email="john.doe@acme.org",
            department="Engineering",
            country="US",
            job_title="Software Engineer",
            base_salary=100000.0,
            currency="USD",
            status="active",
            joined_at=date(2022, 1, 1),
        )
        emp2 = Employee(
            employee_code="EMP-00002",
            first_name="Jane",
            last_name="Smith",
            email="jane.smith@acme.org",
            department="Engineering",
            country="UK",
            job_title="Tech Lead",
            base_salary=90000.0,
            currency="GBP",
            status="active",
            joined_at=date(2021, 5, 10),
        )
        emp3 = Employee(
            employee_code="EMP-00003",
            first_name="Alice",
            last_name="Wong",
            email="alice.wong@acme.org",
            department="Human Resources",
            country="US",
            job_title="HR Specialist",
            base_salary=75000.0,
            currency="USD",
            status="on_leave",
            joined_at=date(2023, 3, 15),
        )
        session.add_all([emp1, emp2, emp3])
        session.commit()
        yield session


def test_get_paginated_employees_all(session: Session):
    response = get_paginated_employees(session=session, page=1, page_size=2)
    assert response.total == 3
    assert len(response.items) == 2
    assert response.total_pages == 2


def test_get_paginated_employees_search(session: Session):
    response = get_paginated_employees(session=session, search="Jane")
    assert response.total == 1
    assert response.items[0].first_name == "Jane"


def test_get_paginated_employees_filter_department(session: Session):
    response = get_paginated_employees(session=session, department="Engineering")
    assert response.total == 2


def test_get_paginated_employees_sorting(session: Session):
    response_desc = get_paginated_employees(session=session, sort_by="base_salary", sort_order="desc")
    assert response_desc.items[0].base_salary == 100000.0

    response_asc = get_paginated_employees(session=session, sort_by="base_salary", sort_order="asc")
    assert response_asc.items[0].base_salary == 75000.0


def test_get_hr_analytics(session: Session):
    analytics = get_hr_analytics(session=session)
    assert analytics.total_employees == 3
    assert analytics.active_employees == 2
    assert len(analytics.departments) == 2
