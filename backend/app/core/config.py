from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "salary-management"
    environment: str = "development"
    database_url: str = "sqlite:///./salary_management.db"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
