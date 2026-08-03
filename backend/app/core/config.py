from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "salary-management"
    environment: str = "development"
    database_url: str = "sqlite:///./salary_management.db"
    secret_key: str = "default_secret_key_change_me_in_env"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24 hours

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()
