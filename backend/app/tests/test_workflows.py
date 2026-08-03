import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.core.database import get_session
from app.core.security import hash_password
from app.main import app
from app.models.user import User
from app.models.workflow_models import ApprovalRequest
from app.services.workflow_service import seed_workflow_defaults_if_empty


@pytest.fixture(name="client")
def client_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        # Seed HR user
        hr_user = User(
            username="hr_admin",
            email="hr.admin@acme.org",
            hashed_password=hash_password("Admin123!@#"),
            role="hr_manager",
        )
        session.add(hr_user)
        session.commit()

        # Seed initial workflow data
        seed_workflow_defaults_if_empty(session)

    def get_session_override():
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_get_workflow_overview(client: TestClient):
    response = client.get("/api/v1/workflows/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["total_pending_approvals"] > 0
    assert data["critical_anomalies_count"] >= 1
    assert len(data["tasks"]) >= 6  # 6 HR Team Specialists


def test_approve_request(client: TestClient):
    login_res = client.post("/api/v1/auth/login", json={"username": "hr_admin", "password": "Admin123!@#"})
    token = login_res.json()["access_token"]

    response = client.post(
        "/api/v1/workflows/approvals/1/action",
        json={"action": "approve", "comment": "Verified salary adjustment"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "approved"


def test_reject_request_without_comment_fails(client: TestClient):
    """Verifies that rejecting an approval request without a comment yields 400 Bad Request."""
    login_res = client.post("/api/v1/auth/login", json={"username": "hr_admin", "password": "Admin123!@#"})
    token = login_res.json()["access_token"]

    response = client.post(
        "/api/v1/workflows/approvals/2/action",
        json={"action": "reject", "comment": ""},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 400
    assert "mandatory" in response.json()["detail"].lower()


def test_reject_request_with_comment_success(client: TestClient):
    """Verifies that rejecting with a valid reason comment succeeds."""
    login_res = client.post("/api/v1/auth/login", json={"username": "hr_admin", "password": "Admin123!@#"})
    token = login_res.json()["access_token"]

    response = client.post(
        "/api/v1/workflows/approvals/2/action",
        json={"action": "reject", "comment": "Exceeds annual department budget limit"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "rejected"
    assert data["rejection_reason"] == "Exceeds annual department budget limit"
