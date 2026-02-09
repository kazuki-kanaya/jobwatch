from functools import lru_cache

import boto3
import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import Settings
from app.database.client import DynamoDBTable
from app.database.host_repository import HostRepository
from app.database.job_repository import JobRepository
from app.database.workspace_repository import WorkspaceRepository
from app.models.exceptions import AuthenticationError
from app.models.host import Host

security = HTTPBearer()


@lru_cache
def get_settings() -> Settings:
    return Settings()  # pyright: ignore[reportCallIssue]


@lru_cache
def get_jwks_client(settings: Settings = Depends(get_settings)) -> jwt.PyJWKClient:
    return jwt.PyJWKClient(settings.oidc_jwks_url)


@lru_cache
def get_dynamodb_table() -> DynamoDBTable:
    settings = get_settings()
    kwargs = settings.dynamodb_kwargs
    dynamodb = boto3.resource("dynamodb", **kwargs)
    table = dynamodb.Table(settings.ddb_table_name)  # pyright: ignore[reportAttributeAccessIssue]
    return DynamoDBTable(table)


def get_workspace_repository() -> WorkspaceRepository:
    table = get_dynamodb_table()
    return WorkspaceRepository(table)


def get_host_repository() -> HostRepository:
    table = get_dynamodb_table()
    return HostRepository(table)


def get_job_repository() -> JobRepository:
    table = get_dynamodb_table()
    return JobRepository(table)


def get_current_host(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    repository: HostRepository = Depends(get_host_repository),
) -> Host:
    """Verify host token and return authenticated host."""
    token = credentials.credentials
    token_hash = Host.hash_token(token)
    host = repository.find_by_token_hash(token_hash)

    if host is None:
        raise AuthenticationError("Invalid host authentication token")

    return host


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    settings: Settings = Depends(get_settings),
    jwks_client: jwt.PyJWKClient = Depends(get_jwks_client),
) -> str:
    """Verify OIDC JWT token and return user sub claim."""
    token = credentials.credentials

    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token).key
        payload = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            issuer=settings.oidc_issuer,
            audience=settings.oidc_audience,
        )
        return payload["sub"]
    except jwt.PyJWTError as e:
        raise AuthenticationError(f"Invalid OIDC token: {e}") from e
