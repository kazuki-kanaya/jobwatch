from functools import lru_cache

import boto3
import jwt

from app.config import Settings
from app.database.client import DynamoDBTable


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore


@lru_cache
def get_jwks_client() -> jwt.PyJWKClient:
    settings = get_settings()
    return jwt.PyJWKClient(settings.oidc_jwks_url)


@lru_cache
def get_dynamodb_table() -> DynamoDBTable:
    settings = get_settings()
    kwargs = settings.dynamodb_kwargs
    dynamodb = boto3.resource("dynamodb", **kwargs)
    table = dynamodb.Table(settings.ddb_table_name)
    return DynamoDBTable(table)
