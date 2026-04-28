from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    database_url_direct: str | None = None

    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_access_ttl_seconds: int = 1800
    jwt_refresh_ttl_seconds: int = 604800

    admin_bootstrap_username: str = "anirudh"
    admin_bootstrap_password: str = ""

    cors_origins: str = "http://localhost:5173"
    env: str = "development"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.env == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]
