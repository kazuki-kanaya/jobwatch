from datetime import datetime

from pydantic import BaseModel

from app.models.workspace_membership import MembershipRole


class WorkspaceInvitationCreateRequest(BaseModel):
    role: MembershipRole = MembershipRole.VIEWER


class WorkspaceInvitationCreateResponse(BaseModel):
    invitation_id: str
    workspace_id: str
    role: MembershipRole
    token: str
    expires_at: datetime
    created_at: datetime


class WorkspaceInvitationResponse(BaseModel):
    invitation_id: str
    workspace_id: str
    role: MembershipRole
    created_by_user_id: str
    expires_at: datetime
    used_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class WorkspaceInvitationsResponse(BaseModel):
    invitations: list[WorkspaceInvitationResponse]


class InvitationAcceptRequest(BaseModel):
    token: str


class InvitationAcceptResponse(BaseModel):
    workspace_id: str
    user_id: str
    role: MembershipRole
