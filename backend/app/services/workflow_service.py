import random
from sqlmodel import Session, select
from fastapi import HTTPException

from app.models.workflow_models import ApprovalRequest, HRTask, PayrollAnomaly
from app.schemas.workflow_schemas import WorkflowOverviewResponse

DYNAMIC_REPLENISH_NAMES = [
  ("Aria Montgomery", "Engineering", "new_hire", 125000.0, "Offer_Aria.pdf"),
  ("Devon Vance", "Product", "salary_adjustment", 110000.0, "Title_Review.pdf"),
  ("Nisha Patel", "Human Resources", "salary_advance", 3500.0, "Advance_Form_NP.pdf"),
  ("Lucas Dupont", "Sales", "reimbursement", 940.0, "Travel_Expense.pdf"),
  ("Kenji Takahashi", "Operations", "salary_adjustment", 98000.0, "Performance_Band.pdf"),
  ("Sarah Jenkins", "Legal", "reimbursement", 1420.0, "Legal_Conference.pdf"),
]


def get_workflow_overview(session: Session) -> WorkflowOverviewResponse:
    """Fetch aggregate overview metrics, anomalies, pending approvals, and team tasks."""
    # Seed default workflow data if tables are empty
    seed_workflow_defaults_if_empty(session)

    # Auto-replenish queue if pending approvals drop below 4 items
    auto_replenish_pending_approvals_if_needed(session)

    anomalies = session.exec(
        select(PayrollAnomaly).where(PayrollAnomaly.resolved == False)
    ).all()

    approvals = session.exec(
        select(ApprovalRequest).where(ApprovalRequest.status == "pending")
    ).all()

    tasks = session.exec(select(HRTask)).all()

    critical_count = len([a for a in anomalies if a.severity == "critical"])

    return WorkflowOverviewResponse(
        total_pending_approvals=len(approvals),
        critical_anomalies_count=critical_count,
        payroll_liquidity_usd=14250000.0,
        available_cash_usd=18500000.0,
        anomalies=list(anomalies),
        approvals=list(approvals),
        tasks=list(tasks),
    )


def process_approval_action(
    session: Session, approval_id: int, action: str, comment: str | None
) -> ApprovalRequest:
    """
    Process approval or rejection.
    Mandatory Rule: Rejection strictly requires a non-empty comment string.
    """
    approval = session.get(ApprovalRequest, approval_id)
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found.")

    if action == "reject":
        if not comment or not comment.strip():
            raise HTTPException(
                status_code=400,
                detail="A rejection reason comment is mandatory when rejecting a request.",
            )
        approval.status = "rejected"
        approval.rejection_reason = comment.strip()
    elif action == "approve":
        approval.status = "approved"
        approval.rejection_reason = comment.strip() if comment else None
    else:
        raise HTTPException(status_code=400, detail="Invalid action type.")

    session.add(approval)
    session.commit()
    session.refresh(approval)
    return approval


def auto_replenish_pending_approvals_if_needed(session: Session) -> None:
    """Auto-generate incoming pending approval requests if count drops below 4."""
    pending_items = session.exec(
        select(ApprovalRequest).where(ApprovalRequest.status == "pending")
    ).all()

    if len(pending_items) < 4:
        needed = 4 - len(pending_items)
        new_records = []
        for _ in range(needed):
            name, dept, req_type, amount, attachment = random.choice(DYNAMIC_REPLENISH_NAMES)
            code = f"EMP-{random.randint(10000, 99999)}"
            new_records.append(
                ApprovalRequest(
                    request_type=req_type,
                    employee_code=code,
                    employee_name=name,
                    department=dept,
                    requested_amount=amount,
                    attachment_filename=attachment,
                    status="pending",
                )
            )
        session.add_all(new_records)
        session.commit()


def seed_workflow_defaults_if_empty(session: Session) -> None:
    """Seed initial HR workflow sample data if empty."""
    existing_approval = session.exec(select(ApprovalRequest)).first()
    if existing_approval:
        return

    # Seed Sample Anomalies
    anomalies = [
        PayrollAnomaly(
            severity="critical",
            title="Japan Regional Salary Deposit Lag",
            description="Banking network clearing delay for Tokyo office June payroll release.",
            region="Japan",
        ),
        PayrollAnomaly(
            severity="warning",
            title="Tax Identification Discrepancy",
            description="3 new hires in UK office missing verified Tax Reference codes.",
            region="UK",
        ),
        PayrollAnomaly(
            severity="warning",
            title="Pay Band Exception Alert",
            description="Senior Engineer compensation in India office exceeds standard department band.",
            region="India",
        ),
    ]

    # Seed Sample Approvals (8 Initial Items)
    approvals = [
        ApprovalRequest(
            request_type="new_hire",
            employee_code="EMP-10492",
            employee_name="Dr. Marcus Vance",
            department="Engineering",
            requested_amount=135000.0,
            attachment_filename="Offer_Letter_Marcus.pdf",
            status="pending",
        ),
        ApprovalRequest(
            request_type="salary_advance",
            employee_code="EMP-08412",
            employee_name="Sophia Chen",
            department="Product",
            requested_amount=4500.0,
            attachment_filename="Advance_Req_Form.pdf",
            status="pending",
        ),
        ApprovalRequest(
            request_type="reimbursement",
            employee_code="EMP-02941",
            employee_name="Amara Okafor",
            department="Sales",
            requested_amount=1280.0,
            attachment_filename="Travel_Expense_Receipt.pdf",
            status="pending",
        ),
        ApprovalRequest(
            request_type="salary_adjustment",
            employee_code="EMP-00128",
            employee_name="Liam O'Connor",
            department="Finance",
            requested_amount=115000.0,
            attachment_filename="Promotion_Review.pdf",
            status="pending",
        ),
        ApprovalRequest(
            request_type="new_hire",
            employee_code="EMP-11920",
            employee_name="Hannah Schmidt",
            department="Operations",
            requested_amount=92000.0,
            attachment_filename="Contract_DE_Hannah.pdf",
            status="pending",
        ),
        ApprovalRequest(
            request_type="reimbursement",
            employee_code="EMP-04192",
            employee_name="Rohan Verma",
            department="Engineering",
            requested_amount=650.0,
            attachment_filename="Certification_Bill.pdf",
            status="pending",
        ),
        ApprovalRequest(
            request_type="salary_adjustment",
            employee_code="EMP-07102",
            employee_name="Elena Rostova",
            department="Human Resources",
            requested_amount=108000.0,
            attachment_filename="HR_Band_Review.pdf",
            status="pending",
        ),
        ApprovalRequest(
            request_type="salary_advance",
            employee_code="EMP-09281",
            employee_name="Tariq Al-Mansoor",
            department="Marketing",
            requested_amount=3000.0,
            attachment_filename="Emergency_Advance.pdf",
            status="pending",
        ),
    ]

    # Seed HR Team Specialists Tasks (6 Specialists)
    tasks = [
        HRTask(
            title="Audit Tokyo Bank Deposit Receipts",
            assigned_to="Sarah Jenkins (Payroll Lead)",
            department="Payroll Operations",
            priority="high",
            status="in_progress",
            due_date="Today",
        ),
        HRTask(
            title="Verify UK Tax Reference Numbers",
            assigned_to="David Ross (UK HR Specialist)",
            department="Compliance",
            priority="high",
            status="todo",
            due_date="Tomorrow",
        ),
        HRTask(
            title="Review Q3 Sales Bonus Claims",
            assigned_to="Elena Rostova (Benefits Admin)",
            department="Compensation",
            priority="medium",
            status="in_progress",
            due_date="Aug 06",
        ),
        HRTask(
            title="Onboard India Regional Engineers",
            assigned_to="Rajesh Kumar (India HR Lead)",
            department="Talent Onboarding",
            priority="medium",
            status="todo",
            due_date="Aug 08",
        ),
        HRTask(
            title="Update Germany Pension Contribution Tables",
            assigned_to="Klaus Weber (DE HR Officer)",
            department="Compliance",
            priority="low",
            status="in_progress",
            due_date="Aug 10",
        ),
        HRTask(
            title="Process Relocation Allowance Approvals",
            assigned_to="Chloe Tremblay (Canada HR Specialist)",
            department="HR Operations",
            priority="medium",
            status="todo",
            due_date="Aug 12",
        ),
    ]

    session.add_all(anomalies + approvals + tasks)
    session.commit()
