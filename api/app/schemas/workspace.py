from datetime import datetime

from pydantic import BaseModel, field_validator

from app.models.workspace_membership import MembershipRole


class WorkspaceCreateRequest(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("name must not be empty")
        return normalized


class WorkspaceUpdateRequest(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("name must not be empty")
        return normalized


class WorkspaceResponse(BaseModel):
    workspace_id: str
    name: str
    created_at: datetime
    updated_at: datetime


class WorkspaceMemberUpsertRequest(BaseModel):
    role: MembershipRole = MembershipRole.VIEWER


class WorkspaceMemberRoleUpdateRequest(BaseModel):
    role: MembershipRole


class WorkspaceOwnerTransferRequest(BaseModel):
    new_owner_user_id: str

    @field_validator("new_owner_user_id")
    @classmethod
    def validate_new_owner_user_id(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("new_owner_user_id must not be empty")
        return normalized


class WorkspaceOwnerTransferResponse(BaseModel):
    workspace_id: str
    previous_owner_user_id: str
    new_owner_user_id: str


class WorkspaceMemberResponse(BaseModel):
    workspace_id: str
    user_id: str
    role: MembershipRole
    created_at: datetime
    updated_at: datetime


class WorkspaceMembersResponse(BaseModel):
    members: list[WorkspaceMemberResponse]
