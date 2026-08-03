from typing import Literal
from sqlmodel import SQLModel
from app.models.workflow_models import ApprovalRequest, HRTask, PayrollAnomaly


class ApprovalActionRequest(SQLModel):
    action: Literal["approve", "reject"]
    comment: str | None = None


class HRTaskCreate(SQLModel):
    title: str
    assigned_to: str
    department: str
    priority: Literal["high", "medium", "low"] = "medium"
    due_date: str


class WorkflowOverviewResponse(SQLModel):
    total_pending_approvals: int
    critical_anomalies_count: int
    payroll_liquidity_usd: float
    available_cash_usd: float
    anomalies: list[PayrollAnomaly]
    approvals: list[ApprovalRequest]
    tasks: list[HRTask]
