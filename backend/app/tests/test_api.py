import pytest
from datetime import date
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.core.database import get_session
from app.core.security import hash_password
from app.main import app
from app.models.employee import Employee
from app.models.user import User


@pytest.fixture(name="client")
def client_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        # Seed test employee
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

        # Seed HR user
        hr_user = User(
            username="hr_admin",
            email="hr.admin@acme.org",
            hashed_password=hash_password("Admin123!@#"),
            role="hr_manager",
        )

        session.add_all([emp1, hr_user])
        session.commit()

    def get_session_override():
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_health_endpoint(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_list_employees_api_v1(client: TestClient):
    response = client.get("/api/v1/employees?page=1&page_size=10")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["employee_code"] == "EMP-00001"


def test_salary_range_filter(client: TestClient):
    res_match = client.get("/api/v1/employees?min_salary=90000&max_salary=110000")
    assert res_match.status_code == 200
    assert res_match.json()["total"] == 1

    res_no_match = client.get("/api/v1/employees?min_salary=150000")
    assert res_no_match.status_code == 200
    assert res_no_match.json()["total"] == 0


def test_login_success(client: TestClient):
    response = client.post("/api/v1/auth/login", json={"username": "hr_admin", "password": "Admin123!@#"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["username"] == "hr_admin"


def test_login_invalid_password(client: TestClient):
    response = client.post("/api/v1/auth/login", json={"username": "hr_admin", "password": "WrongPassword"})
    assert response.status_code == 401


def test_update_employee_unauthorized(client: TestClient):
    response = client.put("/api/v1/employees/1", json={"base_salary": 120000.0})
    assert response.status_code == 401


def test_update_employee_authorized(client: TestClient):
    login_res = client.post("/api/v1/auth/login", json={"username": "hr_admin", "password": "Admin123!@#"})
    token = login_res.json()["access_token"]

    response = client.put(
        "/api/v1/employees/1",
        json={"base_salary": 125000.0, "job_title": "Senior Software Engineer"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["base_salary"] == 125000.0
    assert data["job_title"] == "Senior Software Engineer"


def test_create_employee_authorized(client: TestClient):
    login_res = client.post("/api/v1/auth/login", json={"username": "hr_admin", "password": "Admin123!@#"})
    token = login_res.json()["access_token"]

    new_emp_payload = {
        "employee_code": "EMP-99999",
        "first_name": "Alice",
        "last_name": "Smith",
        "email": "alice.smith@acme.org",
        "department": "Finance",
        "country": "UK",
        "job_title": "Financial Analyst",
        "base_salary": 85000.0,
        "currency": "GBP",
        "status": "active",
        "joined_at": "2024-02-01",
    }

    response = client.post(
        "/api/v1/employees",
        json=new_emp_payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["employee_code"] == "EMP-99999"
    assert data["first_name"] == "Alice"
