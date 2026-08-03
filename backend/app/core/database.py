from collections.abc import Generator
from pathlib import Path

from sqlmodel import Session, SQLModel, create_engine

from app.models.employee import Employee
from app.models.user import User

BASE_DIR = Path(__file__).resolve().parents[2]
DB_PATH = BASE_DIR / "salary_management.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)


def initialize_database() -> None:
    create_db_and_tables()
