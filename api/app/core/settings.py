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
    ddb_jobs_table_name: str = "jobwatch-jobs"
    log_level: str = "INFO"

    def dynamodb_kwargs(self) -> dict[str, object]:
        kwargs: dict[str, object] = {"region_name": self.aws_region}
        if self.ddb_endpoint:
            kwargs["endpoint_url"] = self.ddb_endpoint
        return kwargs
