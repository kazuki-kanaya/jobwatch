from functools import lru_cache

import boto3

from app.core.settings import Settings
from app.infra.dynamodb.table import DynamoDBTable
from app.infra.repositories.dynamodb_host_repository import DynamoDBHostRepository
from app.infra.repositories.dynamodb_job_repository import DynamoDBJobRepository
from app.infra.repositories.dynamodb_workspace_repository import (
    DynamoDBWorkspaceRepository,
)
from app.usecases.host_service import HostService
from app.usecases.job_service import JobService
from app.usecases.workspace_service import WorkspaceService


@lru_cache
def get_settings() -> Settings:
    return Settings()


@lru_cache
def get_dynamodb_table() -> DynamoDBTable:
    settings = get_settings()
    kwargs = settings.dynamodb_kwargs()
    dynamodb = boto3.resource("dynamodb", **kwargs)
    table = dynamodb.Table(settings.ddb_table_name)  # pyright: ignore[reportAttributeAccessIssue]
    return DynamoDBTable(table)


def get_workspace_service() -> WorkspaceService:
    table = get_dynamodb_table()
    workspace_repository = DynamoDBWorkspaceRepository(table)
    return WorkspaceService(workspace_repository)


def get_host_service() -> HostService:
    table = get_dynamodb_table()
    host_repository = DynamoDBHostRepository(table)
    return HostService(host_repository)


def get_job_service() -> JobService:
    table = get_dynamodb_table()
    job_repository = DynamoDBJobRepository(table)
    return JobService(job_repository)
