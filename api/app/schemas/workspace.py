from datetime import datetime

from pydantic import BaseModel

from app.models.workspace_membership import MembershipRole


class WorkspaceCreateRequest(BaseModel):
    name: str


class WorkspaceUpdateRequest(BaseModel):
    name: str


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
