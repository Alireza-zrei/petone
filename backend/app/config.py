from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings, loaded from environment variables and an optional .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Petone API"
    environment: str = "development"
    debug: bool = True
    log_level: str = "INFO"

    database_url: str = "sqlite+aiosqlite:///./petone.db"

    # JWT — SECRET_KEY MUST be overridden via the environment in production.
    secret_key: str = "dev-only-insecure-secret-change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # Payment gateway — set PAYMENT_GATEWAY=shaparak and the SHAPARAK_* values
    # in production once the integration URL is available.
    payment_gateway: str = "fake"
    shaparak_base_url: str = ""
    shaparak_merchant_id: str = ""
    frontend_url: str = "http://localhost:3000"

    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]


settings = Settings()
