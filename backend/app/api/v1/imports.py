import re
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.api.v1.auth import get_current_hr_user
from app.core.database import get_session
from app.models.employee import Employee
from app.models.user import User
from app.schemas.import_schemas import (
    BatchCommitRequest,
    BatchCommitResponse,
    BatchValidateRequest,
    BatchValidateResponse,
    ImportErrorItem,
    ImportValidatedItem,
)

router = APIRouter(prefix="/imports", tags=["excel-imports"])


def sanitize_str(val: Any) -> str:
    """Sanitize input string by removing script tags and HTML markup."""
    if val is None:
        return ""
    text = str(val).strip()
    # Remove HTML/script tags
    clean = re.sub(r"<[^>]*>", "", text)
    clean = re.sub(r"javascript:", "", clean, flags=re.IGNORECASE)
    return clean


@router.post("/validate", response_model=BatchValidateResponse)
def validate_batch_import(
    payload: BatchValidateRequest,
    session: Session = Depends(get_session),
):
    errors: list[ImportErrorItem] = []
    validated: list[ImportValidatedItem] = []

    # Pre-fetch all matching employee codes from DB into memory for instant lookup
    all_employees = session.exec(select(Employee)).all()
    emp_map: dict[str, Employee] = {emp.employee_code.upper(): emp for emp in all_employees}

    for idx, row in enumerate(payload.rows, start=1):
        # Flexible keys from Excel/CSV headers
        raw_code = row.get("employee_code") or row.get("Employee Code") or row.get("EmpCode") or row.get("code") or ""
        raw_name = row.get("name") or row.get("Name") or row.get("Employee Name") or ""
        raw_country = row.get("country") or row.get("Country") or ""
        raw_bonus = row.get("bonus") or row.get("Bonus") or row.get("bonus_amount") or row.get("Bonus Amount") or row.get("New Salary") or "0"

        code = sanitize_str(raw_code).upper()
        name = sanitize_str(raw_name)
        country = sanitize_str(raw_country)
        bonus_str = sanitize_str(raw_bonus)

        # Rule 1: Missing Employee Code
        if not code:
            errors.append(
                ImportErrorItem(
                    row_index=idx,
                    employee_code="N/A",
                    name=name or "Unknown",
                    uploaded_bonus=bonus_str,
                    uploaded_country=country or "N/A",
                    reason="Missing required Employee Code column or empty value",
                )
            )
            continue

        # Rule 2: Employee Code Existence in Database
        emp = emp_map.get(code)
        if not emp:
            errors.append(
                ImportErrorItem(
                    row_index=idx,
                    employee_code=code,
                    name=name or f"Row {idx} Employee",
                    uploaded_bonus=bonus_str,
                    uploaded_country=country or "N/A",
                    reason=f"Employee Code '{code}' not found in organization database",
                )
            )
            continue

        # Rule 3: Country Mismatch (if provided in row)
        if country and country.upper() != emp.country.upper():
            errors.append(
                ImportErrorItem(
                    row_index=idx,
                    employee_code=code,
                    name=f"{emp.first_name} {emp.last_name}",
                    uploaded_bonus=bonus_str,
                    uploaded_country=country,
                    reason=f"Country mismatch: Uploaded '{country}', DB record is '{emp.country}'",
                )
            )
            continue

        # Rule 4: Parse & Validate Numeric Bonus Amount
        try:
            # Clean currency symbols like $ or commas
            clean_bonus_num = float(re.sub(r"[^\d.]", "", bonus_str))
            if clean_bonus_num < 0:
                raise ValueError("Negative bonus")
        except ValueError:
            errors.append(
                ImportErrorItem(
                    row_index=idx,
                    employee_code=code,
                    name=f"{emp.first_name} {emp.last_name}",
                    uploaded_bonus=bonus_str,
                    uploaded_country=emp.country,
                    reason=f"Invalid bonus format: '{bonus_str}' must be a positive number",
                )
            )
            continue

        # Rule 5: Excessive Threshold Check
        if clean_bonus_num > 500000:
            errors.append(
                ImportErrorItem(
                    row_index=idx,
                    employee_code=code,
                    name=f"{emp.first_name} {emp.last_name}",
                    uploaded_bonus=f"${clean_bonus_num:,.2f}",
                    uploaded_country=emp.country,
                    reason="Excessive bonus limit: Exceeds company threshold of $500,000",
                )
            )
            continue

        # All checks passed! Add to validated list
        full_name = f"{emp.first_name} {emp.last_name}"
        total_comp = round(emp.base_salary + clean_bonus_num, 2)

        validated.append(
            ImportValidatedItem(
                row_index=idx,
                employee_code=emp.employee_code,
                name=full_name,
                department=emp.department,
                country=emp.country,
                current_salary=emp.base_salary,
                bonus_amount=clean_bonus_num,
                new_total_compensation=total_comp,
            )
        )

    return BatchValidateResponse(
        total_rows=len(payload.rows),
        valid_count=len(validated),
        error_count=len(errors),
        errors=errors,
        validated=validated,
    )


@router.post("/commit", response_model=BatchCommitResponse)
def commit_batch_import(
    payload: BatchCommitRequest,
    current_user: User = Depends(get_current_hr_user),
    session: Session = Depends(get_session),
):
    if not payload.validated_rows:
        return BatchCommitResponse(
            success=True,
            message="No validated records provided for import commit.",
            records_updated=0,
        )

    updated_count = 0
    for item in payload.validated_rows:
        statement = select(Employee).where(Employee.employee_code == item.employee_code)
        emp = session.exec(statement).first()
        if emp:
            emp.base_salary = round(emp.base_salary + item.bonus_amount, 2)
            session.add(emp)
            updated_count += 1

    session.commit()

    return BatchCommitResponse(
        success=True,
        message=f"Successfully committed {updated_count} compensation records to the database.",
        records_updated=updated_count,
    )
