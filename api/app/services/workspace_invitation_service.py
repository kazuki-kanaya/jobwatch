from datetime import timedelta
from uuid import uuid4

from app.config import Settings
from app.database.workspace_invitation_repository import WorkspaceInvitationRepository
from app.database.workspace_membership_repository import WorkspaceMembershipRepository
from app.database.workspace_repository import WorkspaceRepository
from app.models.exceptions import (
    ConditionalCheckFailedError,
    NotFoundException,
    PermissionDeniedError,
)
from app.models.user import User
from app.models.workspace_membership import WorkspaceMembership
from app.models.workspace_invitation import WorkspaceInvitation
from app.schemas.invitation import (
    InvitationAcceptRequest,
    InvitationAcceptResponse,
    WorkspaceInvitationCreateRequest,
    WorkspaceInvitationCreateResponse,
    WorkspaceInvitationResponse,
    WorkspaceInvitationsResponse,
)
from app.utils.datetime import now


class WorkspaceInvitationService:
    def __init__(
        self,
        settings: Settings,
        workspace_repository: WorkspaceRepository,
        workspace_membership_repository: WorkspaceMembershipRepository,
        workspace_invitation_repository: WorkspaceInvitationRepository,
    ) -> None:
        self._settings = settings
        self._workspace_repository = workspace_repository
        self._workspace_membership_repository = workspace_membership_repository
        self._workspace_invitation_repository = workspace_invitation_repository

    def create_invitation(
        self,
        workspace_id: str,
        request: WorkspaceInvitationCreateRequest,
        current_user: User,
    ) -> WorkspaceInvitationCreateResponse:
        workspace = self._workspace_repository.get(workspace_id)
        if workspace is None:
            raise NotFoundException(f"Workspace {workspace_id} not found")
        token = WorkspaceInvitation.generate_token()
        invitation = WorkspaceInvitation(
            invitation_id=f"inv-{uuid4().hex[:10]}",
            workspace_id=workspace_id,
            role=request.role,
            token_hash=WorkspaceInvitation.hash_token(token),
            created_by_user_id=current_user.user_id,
            expires_at=now() + timedelta(hours=self._settings.invitation_expiry_hours),
        )
        created = self._workspace_invitation_repository.create(invitation)
        return WorkspaceInvitationCreateResponse(
            invitation_id=created.invitation_id,
            workspace_id=created.workspace_id,
            role=created.role,
            token=token,
            expires_at=created.expires_at,
            created_at=created.created_at,
        )

    def list_invitations(self, workspace_id: str) -> WorkspaceInvitationsResponse:
        workspace = self._workspace_repository.get(workspace_id)
        if workspace is None:
            raise NotFoundException(f"Workspace {workspace_id} not found")
        invitations = list(
            self._workspace_invitation_repository.list_by_workspace(workspace_id)
        )
        invitations.sort(key=lambda invitation: invitation.created_at, reverse=True)
        return WorkspaceInvitationsResponse(
            invitations=[
                WorkspaceInvitationResponse(
                    invitation_id=invitation.invitation_id,
                    workspace_id=invitation.workspace_id,
                    role=invitation.role,
                    created_by_user_id=invitation.created_by_user_id,
                    expires_at=invitation.expires_at,
                    used_at=invitation.used_at,
                    created_at=invitation.created_at,
                    updated_at=invitation.updated_at,
                )
                for invitation in invitations
            ]
        )

    def revoke_invitation(self, workspace_id: str, invitation_id: str) -> None:
        invitation = self._workspace_invitation_repository.get(
            workspace_id, invitation_id
        )
        if invitation is None:
            raise NotFoundException(
                f"Invitation {invitation_id} not found in workspace {workspace_id}"
            )
        self._workspace_invitation_repository.revoke(workspace_id, invitation_id)

    def accept_invitation(
        self, request: InvitationAcceptRequest, current_user: User
    ) -> InvitationAcceptResponse:
        token_hash = WorkspaceInvitation.hash_token(request.token)
        invitation = self._workspace_invitation_repository.find_by_token_hash(
            token_hash
        )
        if invitation is None:
            raise PermissionDeniedError("Invitation is invalid")
        if invitation.used_at is not None:
            raise PermissionDeniedError("Invitation has already been used")
        if invitation.expires_at < now():
            raise PermissionDeniedError("Invitation has expired")

        try:
            self._workspace_invitation_repository.mark_used(
                invitation.workspace_id, invitation.invitation_id
            )
        except ConditionalCheckFailedError as e:
            raise PermissionDeniedError("Invitation has already been used") from e

        membership = self._workspace_membership_repository.get(
            invitation.workspace_id, current_user.user_id
        )
        if membership is None:
            self._workspace_membership_repository.create(
                workspace_membership=WorkspaceMembership(
                    workspace_id=invitation.workspace_id,
                    user_id=current_user.user_id,
                    role=invitation.role,
                )
            )

        return InvitationAcceptResponse(
            workspace_id=invitation.workspace_id,
            user_id=current_user.user_id,
            role=invitation.role,
        )
