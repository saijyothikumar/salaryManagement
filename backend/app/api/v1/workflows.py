from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.core.database import get_session
from app.models.workflow_models import ApprovalRequest, HRTask
from app.schemas.workflow_schemas import ApprovalActionRequest, HRTaskCreate, WorkflowOverviewResponse
from app.services.workflow_service import get_workflow_overview, process_approval_action

router = APIRouter(prefix="/workflows", tags=["Workflows"])


@router.get("/overview", response_model=WorkflowOverviewResponse)
def get_overview(session: Session = Depends(get_session)):
    """
    Get aggregate HR Command Center overview stats, anomalies, pending approvals, and team tasks.
    """
    try:
        return get_workflow_overview(session)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load workflow overview: {str(e)}")


@router.post("/approvals/{approval_id}/action", response_model=ApprovalRequest)
def handle_approval_action(
    approval_id: int,
    payload: ApprovalActionRequest,
    session: Session = Depends(get_session),
):
    """
    Approve or reject a pending request in HR Command Center.
    Note: Rejection strictly requires a non-empty comment.
    """
    return process_approval_action(
        session=session,
        approval_id=approval_id,
        action=payload.action,
        comment=payload.comment,
    )


@router.post("/tasks", response_model=HRTask)
def create_task(
    payload: HRTaskCreate,
    session: Session = Depends(get_session),
):
    """
    Assign a new task to an HR specialist team member.
    """
    task = HRTask.model_validate(payload)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
