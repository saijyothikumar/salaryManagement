import pytest
from fastapi.testclient import TestClient
from app.main import app


def test_validate_batch_import_success_and_error_split():
    with TestClient(app) as client:
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


def test_commit_batch_import_requires_auth():
    with TestClient(app) as client:
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
