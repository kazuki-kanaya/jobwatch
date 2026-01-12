from functools import lru_cache

import boto3

from app.core.settings import Settings
from app.infra.repositories.dynamodb_job_repository import DynamoDBJobRepository
from app.ports.job_repository import JobRepository
from app.usecases.job_service import JobService


@lru_cache
def get_settings() -> Settings:
    return Settings()


@lru_cache
def _build_dynamodb_resource() -> object:
    settings = get_settings()
    return boto3.resource("dynamodb", **settings.dynamodb_kwargs())


print(get_settings())


@lru_cache
def get_job_repository() -> JobRepository:
    table_name = get_settings().ddb_jobs_table_name
    return DynamoDBJobRepository(
        table_name=table_name,
        dynamodb_resource=_build_dynamodb_resource(),
    )


def get_job_service() -> JobService:
    return JobService(get_job_repository())
