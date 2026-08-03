from datetime import datetime, timezone
from sqlmodel import Field, SQLModel


def get_utc_now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


class ApprovalRequest(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    request_type: str = Field(index=True)  # "new_hire", "salary_adjustment", "salary_advance", "reimbursement"
    employee_code: str = Field(index=True)
    employee_name: str
    department: str = Field(index=True)
    requested_amount: float
    attachment_filename: str | None = None  # e.g. "Receipt_1092.pdf"
    status: str = Field(default="pending", index=True)  # "pending", "approved", "rejected"
    rejection_reason: str | None = None
    created_at: datetime = Field(default_factory=get_utc_now)


class HRTask(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    assigned_to: str = Field(index=True)  # e.g. "Sarah Jenkins (Payroll Specialist)"
    department: str
    priority: str = Field(default="medium")  # "high", "medium", "low"
    status: str = Field(default="todo", index=True)  # "todo", "in_progress", "completed"
    due_date: str
    created_at: datetime = Field(default_factory=get_utc_now)


class PayrollAnomaly(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    severity: str = Field(default="warning")  # "critical", "warning"
    title: str
    description: str
    region: str
    resolved: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=get_utc_now)
