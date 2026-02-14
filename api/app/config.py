import logging
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="JOBWATCH_",
        case_sensitive=False,
        env_file=".env",
        env_file_encoding="utf-8",
    )

    ddb_endpoint: str | None = None
    aws_region: str = "ap-northeast-1"
    aws_access_key: str = "dummy"
    aws_secret_key: str = "dummy"
    ddb_table_name: str = "jobwatch-dev"
    log_level: str = "INFO"
    app_timezone: str = "Asia/Tokyo"
    invitation_expiry_hours: int = 168
    cors_allowed_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    oidc_jwks_url: str
    oidc_audience: str
    oidc_issuer: str

    @property
    def dynamodb_kwargs(self) -> dict[str, object]:
        kwargs: dict[str, object] = {"region_name": self.aws_region}
        if self.ddb_endpoint:
            kwargs["endpoint_url"] = self.ddb_endpoint
        return kwargs


def configure_logging(level: str) -> None:
    logging.basicConfig(
        level=level,
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
    )
