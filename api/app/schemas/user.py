from datetime import datetime
from pydantic import BaseModel, field_validator

from app.schemas.workspace import WorkspaceResponse


class UserResponse(BaseModel):
    user_id: str
    name: str
    created_at: datetime
    updated_at: datetime


class UserWorkspacesResponse(BaseModel):
    workspaces: list[WorkspaceResponse]


class UserUpdateRequest(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("name must not be empty")
        return normalized


class UserLookupRequest(BaseModel):
    user_ids: list[str]


class UserLookupResponse(BaseModel):
    users: list[UserResponse]
    not_found_user_ids: list[str] = []
