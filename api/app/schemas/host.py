from datetime import datetime

from pydantic import BaseModel, field_validator


class HostCreateRequest(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("name must not be empty")
        return normalized


class HostUpdateRequest(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("name must not be empty")
        return normalized


class HostCreateResponse(BaseModel):
    host_id: str
    workspace_id: str
    name: str
    token: str
    created_at: datetime
    updated_at: datetime
    message: str


class HostResponse(BaseModel):
    host_id: str
    workspace_id: str
    name: str
    created_at: datetime
    updated_at: datetime
