from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.core.database import get_session
from app.schemas.employee_read import HRAnalyticsResponse
from app.services.employee_service import get_hr_analytics

router = APIRouter(prefix="/analytics", tags=["HR Analytics"])


@router.get("", response_model=HRAnalyticsResponse)
def get_analytics(
    session: Session = Depends(get_session),
):
    """
    Get organization-wide salary analytics, department breakdowns, and country pay stats.
    """
    try:
        return get_hr_analytics(session=session)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate analytics: {str(e)}")
