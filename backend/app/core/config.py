from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    CLERK_SECRET_KEY: str
    CLERK_PUBLISHABLE_KEY: str
    CLERK_WEBHOOK_SECRET: str
    CLERK_JWKS_URL: str

    DATABASE_URL: str
    REDIS_URL: str = "redis://localhost:6379/0"
    FRONTEND_URL: str

settings = Settings()