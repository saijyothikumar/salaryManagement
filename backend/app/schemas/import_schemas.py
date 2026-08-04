from typing import Any
from pydantic import BaseModel, Field


class ImportErrorItem(BaseModel):
    row_index: int
    employee_code: str
    name: str = "N/A"
    uploaded_bonus: str = "0"
    uploaded_country: str = "N/A"
    reason: str


class ImportValidatedItem(BaseModel):
    row_index: int
    employee_code: str
    name: str
    department: str
    country: str
    current_salary: float
    bonus_amount: float
    new_total_compensation: float


class BatchValidateRequest(BaseModel):
    rows: list[dict[str, Any]]


class BatchValidateResponse(BaseModel):
    total_rows: int
    valid_count: int
    error_count: int
    errors: list[ImportErrorItem]
    validated: list[ImportValidatedItem]


class BatchCommitRequest(BaseModel):
    validated_rows: list[ImportValidatedItem]


class BatchCommitResponse(BaseModel):
    success: bool
    message: str
    records_updated: int
