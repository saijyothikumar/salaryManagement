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
        # Seed test employee (EMP-00001)
        emp1 = Employee(
            employee_code="EMP-00001",
            first_name="Sarah",
            last_name="Connor",
            email="sarah.connor@acme.org",
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
        session.add(emp1)
        session.add(hr_user)
        session.commit()

    def get_session_override():
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_validate_batch_import_success_and_error_split(client: TestClient):
    payload = {
        "rows": [
            # Valid row (EMP-00001 exists in database)
            {
                "employee_code": "EMP-00001",
                "name": "Sarah Connor",
                "country": "US",
                "bonus": "2500",
            },
            # Error row: Non-existent employee code
            {
                "employee_code": "EMP-99999",
                "name": "Ghost User",
                "country": "US",
                "bonus": "1000",
            },
            # Error row: Country mismatch
            {
                "employee_code": "EMP-00001",
                "name": "Sarah Connor",
                "country": "NonExistentCountry",
                "bonus": "1500",
            },
            # Error row: Invalid bonus format
            {
                "employee_code": "EMP-00001",
                "name": "Sarah Connor",
                "country": "US",
                "bonus": "abc_invalid",
            },
        ]
    }

    response = client.post("/api/v1/imports/validate", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["total_rows"] == 4
    assert data["valid_count"] >= 1
    assert data["error_count"] >= 2

    # Verify error reasons
    error_reasons = [err["reason"] for err in data["errors"]]
    assert any("not found in organization database" in r for r in error_reasons)
    assert any("Invalid bonus format" in r for r in error_reasons)


def test_commit_batch_import_requires_auth(client: TestClient):
    payload = {
        "validated_rows": [
            {
                "row_index": 1,
                "employee_code": "EMP-00001",
                "name": "Sarah Connor",
                "department": "Engineering",
                "country": "US",
                "current_salary": 100000.0,
                "bonus_amount": 5000.0,
                "new_total_compensation": 105000.0,
            }
        ]
    }

    response = client.post("/api/v1/imports/commit", json=payload)
    assert response.status_code == 401  # Unauthorized without Bearer token

