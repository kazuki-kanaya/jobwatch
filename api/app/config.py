import logging
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="OBSERN_",
        case_sensitive=False,
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    aws_region: str = "ap-northeast-1"
    ddb_endpoint: str
    aws_access_key: str
    aws_secret_key: str
    ddb_table_name: str = "obsern-dev"
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
        return {
            "region_name": self.aws_region,
            "endpoint_url": self.ddb_endpoint,
            "aws_access_key_id": self.aws_access_key,
            "aws_secret_access_key": self.aws_secret_key,
        }


def configure_logging(level: str) -> None:
    logging.basicConfig(
        level=level,
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
    )
