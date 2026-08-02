import pytest
from datetime import date
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.core.database import get_session
from app.main import app
from app.models.employee import Employee


@pytest.fixture(name="client")
def client_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
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
        session.add(emp1)
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


def test_analytics_api_v1(client: TestClient):
    response = client.get("/api/v1/analytics")
    assert response.status_code == 200
    data = response.json()
    assert data["total_employees"] == 1
    assert data["active_employees"] == 1
