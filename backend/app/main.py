from fastapi import FastAPI

from app.core.config import settings
from app.core.database import initialize_database

app = FastAPI(title=settings.app_name, version="0.1.0")


@app.on_event("startup")
def startup_event() -> None:
    initialize_database()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Salary Management API skeleton"}
