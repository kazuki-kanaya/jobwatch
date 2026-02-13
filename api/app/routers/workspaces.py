from fastapi import APIRouter, Depends, status

from app.dependencies.security import get_current_user, require_workspace_role
from app.dependencies.services import (
    get_workspace_invitation_service,
    get_workspace_service,
)
from app.models.user import User
from app.models.workspace_membership import MembershipRole, WorkspaceMembership
from app.schemas.invitation import (
    WorkspaceInvitationCreateRequest,
    WorkspaceInvitationCreateResponse,
    WorkspaceInvitationsResponse,
)
from app.schemas.workspace import (
    WorkspaceCreateRequest,
    WorkspaceMemberUpsertRequest,
    WorkspaceMemberResponse,
    WorkspaceMemberRoleUpdateRequest,
    WorkspaceOwnerTransferRequest,
    WorkspaceOwnerTransferResponse,
    WorkspaceMembersResponse,
    WorkspaceResponse,
    WorkspaceUpdateRequest,
)
from app.services.workspace_invitation_service import WorkspaceInvitationService
from app.services.workspace_service import WorkspaceService

router = APIRouter(prefix="/workspaces", tags=["workspaces"])


@router.post("", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED)
def create_workspace(
    request: WorkspaceCreateRequest,
    workspace_service: WorkspaceService = Depends(get_workspace_service),
    current_user: User = Depends(get_current_user),
) -> WorkspaceResponse:
    """Create a new workspace."""
    return workspace_service.create_workspace(request, current_user)


@router.get("/{workspace_id}", response_model=WorkspaceResponse)
def get_workspace(
    workspace_id: str,
    workspace_service: WorkspaceService = Depends(get_workspace_service),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.VIEWER)),
) -> WorkspaceResponse:
    """Get a single workspace by ID."""
    return workspace_service.get_workspace(workspace_id)


@router.patch("/{workspace_id}", response_model=WorkspaceResponse)
def update_workspace(
    workspace_id: str,
    request: WorkspaceUpdateRequest,
    workspace_service: WorkspaceService = Depends(get_workspace_service),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.OWNER)),
) -> WorkspaceResponse:
    """Update a workspace's information."""
    return workspace_service.update_workspace(workspace_id, request)


@router.delete("/{workspace_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workspace(
    workspace_id: str,
    workspace_service: WorkspaceService = Depends(get_workspace_service),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.OWNER)),
) -> None:
    """Delete a workspace and all its associated resources."""
    workspace_service.delete_workspace(workspace_id)


@router.get("/{workspace_id}/members", response_model=WorkspaceMembersResponse)
def list_members(
    workspace_id: str,
    workspace_service: WorkspaceService = Depends(get_workspace_service),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.VIEWER)),
) -> WorkspaceMembersResponse:
    """List members in a workspace."""
    return workspace_service.list_members(workspace_id)


@router.put("/{workspace_id}/members/{user_id}", response_model=WorkspaceMemberResponse)
def add_member(
    workspace_id: str,
    user_id: str,
    request: WorkspaceMemberUpsertRequest,
    workspace_service: WorkspaceService = Depends(get_workspace_service),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.OWNER)),
) -> WorkspaceMemberResponse:
    """Add a member to a workspace."""
    return workspace_service.add_member(workspace_id, user_id, request)


@router.patch(
    "/{workspace_id}/members/{user_id}",
    response_model=WorkspaceMemberResponse,
)
def update_member_role(
    workspace_id: str,
    user_id: str,
    request: WorkspaceMemberRoleUpdateRequest,
    workspace_service: WorkspaceService = Depends(get_workspace_service),
    current_user: User = Depends(get_current_user),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.OWNER)),
) -> WorkspaceMemberResponse:
    """Update a member role in a workspace."""
    return workspace_service.update_member_role(
        workspace_id, user_id, request, current_user
    )


@router.delete(
    "/{workspace_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT
)
def remove_member(
    workspace_id: str,
    user_id: str,
    workspace_service: WorkspaceService = Depends(get_workspace_service),
    current_user: User = Depends(get_current_user),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.OWNER)),
) -> None:
    """Remove a member from a workspace."""
    workspace_service.remove_member(workspace_id, user_id, current_user)


@router.post("/{workspace_id}/owner", response_model=WorkspaceOwnerTransferResponse)
def transfer_owner(
    workspace_id: str,
    request: WorkspaceOwnerTransferRequest,
    workspace_service: WorkspaceService = Depends(get_workspace_service),
    current_user: User = Depends(get_current_user),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.OWNER)),
) -> WorkspaceOwnerTransferResponse:
    """Transfer workspace ownership to another member."""
    return workspace_service.transfer_owner(workspace_id, request, current_user)


@router.post(
    "/{workspace_id}/invitations",
    response_model=WorkspaceInvitationCreateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_invitation(
    workspace_id: str,
    request: WorkspaceInvitationCreateRequest,
    invitation_service: WorkspaceInvitationService = Depends(
        get_workspace_invitation_service
    ),
    current_user: User = Depends(get_current_user),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.OWNER)),
) -> WorkspaceInvitationCreateResponse:
    """Create invitation token for workspace onboarding."""
    return invitation_service.create_invitation(workspace_id, request, current_user)


@router.get(
    "/{workspace_id}/invitations",
    response_model=WorkspaceInvitationsResponse,
)
def list_invitations(
    workspace_id: str,
    invitation_service: WorkspaceInvitationService = Depends(
        get_workspace_invitation_service
    ),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.OWNER)),
) -> WorkspaceInvitationsResponse:
    """List workspace invitations."""
    return invitation_service.list_invitations(workspace_id)


@router.delete(
    "/{workspace_id}/invitations/{invitation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def revoke_invitation(
    workspace_id: str,
    invitation_id: str,
    invitation_service: WorkspaceInvitationService = Depends(
        get_workspace_invitation_service
    ),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.OWNER)),
) -> None:
    """Revoke a workspace invitation."""
    invitation_service.revoke_invitation(workspace_id, invitation_id)
