from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select, col

from app.core.config import settings
from app.core.database import get_session, initialize_database
from app.models.employee import Employee
from app.schemas.employee_read import EmployeeRead

import logging
from fastapi import HTTPException

logger = logging.getLogger("salary_management")
@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_database()
    yield


app = FastAPI(title="salary-management", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/employees", response_model=list[EmployeeRead])
def list_employees(session: Session = Depends(get_session)):
    try:
        employees = session.exec(select(Employee).order_by(col(Employee.id))).all()
        return employees
    except Exception:
        logger.exception("Failed to load employees")
        raise HTTPException(status_code=500, detail="Failed to load employees")