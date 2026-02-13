from uuid import uuid4

from app.database.workspace_membership_repository import WorkspaceMembershipRepository
from app.database.workspace_repository import WorkspaceRepository
from app.models.exceptions import NotFoundException, PermissionDeniedError
from app.models.user import User
from app.models.workspace import Workspace
from app.models.workspace_membership import MembershipRole, WorkspaceMembership
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


class WorkspaceService:
    def __init__(
        self,
        workspace_repository: WorkspaceRepository,
        workspace_membership_repository: WorkspaceMembershipRepository,
    ) -> None:
        self._workspace_repository = workspace_repository
        self._workspace_membership_repository = workspace_membership_repository

    def create_workspace(
        self, request: WorkspaceCreateRequest, current_user: User
    ) -> WorkspaceResponse:
        workspace = Workspace(
            workspace_id=f"workspace-{uuid4().hex[:8]}",
            name=request.name,
        )
        membership = WorkspaceMembership(
            workspace_id=workspace.workspace_id,
            user_id=current_user.user_id,
            role=MembershipRole.OWNER,
        )
        created = self._workspace_repository.create_with_owner(workspace, membership)
        return WorkspaceResponse(
            workspace_id=created.workspace_id,
            name=created.name,
            created_at=created.created_at,
            updated_at=created.updated_at,
        )

    def get_workspace(self, workspace_id: str) -> WorkspaceResponse:
        workspace = self._workspace_repository.get(workspace_id)
        if workspace is None:
            raise NotFoundException(f"Workspace {workspace_id} not found")
        return WorkspaceResponse(
            workspace_id=workspace.workspace_id,
            name=workspace.name,
            created_at=workspace.created_at,
            updated_at=workspace.updated_at,
        )

    def update_workspace(
        self,
        workspace_id: str,
        request: WorkspaceUpdateRequest,
    ) -> WorkspaceResponse:
        workspace = self._workspace_repository.get(workspace_id)
        if workspace is None:
            raise NotFoundException(f"Workspace {workspace_id} not found")
        workspace.name = request.name
        workspace.touch()
        updated = self._workspace_repository.update(workspace)
        return WorkspaceResponse(
            workspace_id=updated.workspace_id,
            name=updated.name,
            created_at=updated.created_at,
            updated_at=updated.updated_at,
        )

    def delete_workspace(self, workspace_id: str) -> None:
        workspace = self._workspace_repository.get(workspace_id)
        if workspace is None:
            raise NotFoundException(f"Workspace {workspace_id} not found")
        self._workspace_repository.delete(workspace)

    def list_members(self, workspace_id: str) -> WorkspaceMembersResponse:
        workspace = self._workspace_repository.get(workspace_id)
        if workspace is None:
            raise NotFoundException(f"Workspace {workspace_id} not found")
        members = list(
            self._workspace_membership_repository.list_by_workspace(workspace_id)
        )
        members.sort(key=lambda member: member.created_at)
        return WorkspaceMembersResponse(
            members=[
                WorkspaceMemberResponse(
                    workspace_id=member.workspace_id,
                    user_id=member.user_id,
                    role=member.role,
                    created_at=member.created_at,
                    updated_at=member.updated_at,
                )
                for member in members
            ]
        )

    def add_member(
        self, workspace_id: str, user_id: str, request: WorkspaceMemberUpsertRequest
    ) -> WorkspaceMemberResponse:
        workspace = self._workspace_repository.get(workspace_id)
        if workspace is None:
            raise NotFoundException(f"Workspace {workspace_id} not found")
        existing = self._workspace_membership_repository.get(workspace_id, user_id)
        if existing is None:
            existing = self._workspace_membership_repository.create(
                WorkspaceMembership(
                    workspace_id=workspace_id,
                    user_id=user_id,
                    role=request.role,
                )
            )
        return WorkspaceMemberResponse(
            workspace_id=existing.workspace_id,
            user_id=existing.user_id,
            role=existing.role,
            created_at=existing.created_at,
            updated_at=existing.updated_at,
        )

    def update_member_role(
        self,
        workspace_id: str,
        user_id: str,
        request: WorkspaceMemberRoleUpdateRequest,
        current_user: User,
    ) -> WorkspaceMemberResponse:
        membership = self._workspace_membership_repository.get(workspace_id, user_id)
        if membership is None:
            raise NotFoundException(
                f"Member {user_id} not found in workspace {workspace_id}"
            )
        if (
            current_user.user_id == user_id
            and membership.role == MembershipRole.OWNER
            and request.role != MembershipRole.OWNER
        ):
            raise PermissionDeniedError("Owner cannot demote themselves")
        self._assert_owner_not_removed(workspace_id, membership, request.role)
        membership.role = request.role
        membership.touch()
        updated = self._workspace_membership_repository.update(membership)
        return WorkspaceMemberResponse(
            workspace_id=updated.workspace_id,
            user_id=updated.user_id,
            role=updated.role,
            created_at=updated.created_at,
            updated_at=updated.updated_at,
        )

    def remove_member(
        self, workspace_id: str, user_id: str, current_user: User
    ) -> None:
        membership = self._workspace_membership_repository.get(workspace_id, user_id)
        if membership is None:
            raise NotFoundException(
                f"Member {user_id} not found in workspace {workspace_id}"
            )
        if current_user.user_id == user_id and membership.role == MembershipRole.OWNER:
            raise PermissionDeniedError("Owner cannot remove themselves")
        self._assert_owner_not_removed(workspace_id, membership, None)
        self._workspace_membership_repository.delete(workspace_id, user_id)

    def transfer_owner(
        self,
        workspace_id: str,
        request: WorkspaceOwnerTransferRequest,
        current_user: User,
    ) -> WorkspaceOwnerTransferResponse:
        if request.new_owner_user_id == current_user.user_id:
            raise PermissionDeniedError(
                "New owner must be different from current owner"
            )

        current_owner_membership = self._workspace_membership_repository.get(
            workspace_id, current_user.user_id
        )
        if (
            current_owner_membership is None
            or current_owner_membership.role != MembershipRole.OWNER
        ):
            raise PermissionDeniedError("Only owner can transfer ownership")

        new_owner_membership = self._workspace_membership_repository.get(
            workspace_id, request.new_owner_user_id
        )
        if new_owner_membership is None:
            raise NotFoundException(
                f"Member {request.new_owner_user_id} not found in workspace {workspace_id}"
            )
        self._workspace_membership_repository.transfer_owner(
            workspace_id=workspace_id,
            from_user_id=current_user.user_id,
            to_user_id=request.new_owner_user_id,
        )

        return WorkspaceOwnerTransferResponse(
            workspace_id=workspace_id,
            previous_owner_user_id=current_user.user_id,
            new_owner_user_id=request.new_owner_user_id,
        )

    def _assert_owner_not_removed(
        self,
        workspace_id: str,
        current_membership: WorkspaceMembership,
        target_role: MembershipRole | None,
    ) -> None:
        if current_membership.role != MembershipRole.OWNER:
            return
        if target_role == MembershipRole.OWNER:
            return
        members = list(
            self._workspace_membership_repository.list_by_workspace(workspace_id)
        )
        owner_count = sum(
            1 for member in members if member.role == MembershipRole.OWNER
        )
        if owner_count <= 1:
            raise PermissionDeniedError("Workspace must have at least one owner")
