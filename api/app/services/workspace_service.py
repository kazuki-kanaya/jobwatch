from uuid import uuid4

from app.database.workspace_membership_repository import WorkspaceMembershipRepository
from app.database.workspace_repository import WorkspaceRepository
from app.models.exceptions import (
    ConditionalCheckFailedError,
    NotFoundException,
    PermissionDeniedError,
    QuotaExceededError,
)
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
from app.services.entitlement_service import EntitlementService


class WorkspaceService:
    def __init__(
        self,
        workspace_repository: WorkspaceRepository,
        workspace_membership_repository: WorkspaceMembershipRepository,
        entitlement_service: EntitlementService,
    ) -> None:
        self._workspace_repository = workspace_repository
        self._workspace_membership_repository = workspace_membership_repository
        self._entitlement_service = entitlement_service

    def create_workspace(
        self, request: WorkspaceCreateRequest, current_user: User
    ) -> WorkspaceResponse:
        entitlement = self._entitlement_service.assert_can_create_workspace(
            current_user.user_id
        )
        workspace = Workspace(
            workspace_id=f"workspace-{uuid4().hex[:8]}",
            name=request.name,
        )
        membership = WorkspaceMembership(
            workspace_id=workspace.workspace_id,
            user_id=current_user.user_id,
            role=MembershipRole.OWNER,
        )
        try:
            created = self._workspace_repository.create_with_owner(
                workspace,
                membership,
                expected_owner_count=entitlement.workspace_count,
                max_owned_workspaces=entitlement.limits.max_workspaces,
            )
        except ConditionalCheckFailedError as exc:
            raise QuotaExceededError(
                f"Workspace limit reached for the {entitlement.plan.value} plan"
            ) from exc
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
            membership = WorkspaceMembership(
                workspace_id=workspace_id,
                user_id=user_id,
                role=request.role,
            )
            if request.role is MembershipRole.OWNER:
                entitlement = self._entitlement_service.assert_can_create_workspace(
                    user_id
                )
                existing = self._workspace_membership_repository.create(
                    membership,
                    expected_owner_count=entitlement.workspace_count,
                    max_owned_workspaces=entitlement.limits.max_workspaces,
                )
            else:
                existing = self._workspace_membership_repository.create(membership)
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
        previous_role = membership.role
        entitlement = None
        if previous_role is not request.role:
            entitlement = self._entitlement_service.get_for_user(user_id)
            if (
                previous_role is not MembershipRole.OWNER
                and request.role is MembershipRole.OWNER
            ):
                entitlement = self._entitlement_service.assert_can_create_workspace(
                    user_id
                )
        membership.role = request.role
        membership.touch()
        updated = self._workspace_membership_repository.update(
            membership,
            previous_role=previous_role,
            expected_owner_count=(entitlement.workspace_count if entitlement else None),
            max_owned_workspaces=(
                entitlement.limits.max_workspaces if entitlement else None
            ),
        )
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
        self._workspace_membership_repository.delete(workspace_id, user_id, membership)

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
        from_entitlement = self._entitlement_service.get_for_user(current_user.user_id)
        to_entitlement = self._entitlement_service.get_for_user(
            request.new_owner_user_id
        )
        if new_owner_membership.role is not MembershipRole.OWNER:
            to_entitlement = self._entitlement_service.assert_can_create_workspace(
                request.new_owner_user_id
            )
        self._workspace_membership_repository.transfer_owner(
            workspace_id=workspace_id,
            from_user_id=current_user.user_id,
            to_user_id=request.new_owner_user_id,
            new_owner_role=new_owner_membership.role,
            from_owner_count=from_entitlement.workspace_count,
            to_owner_count=to_entitlement.workspace_count,
            max_owned_workspaces=to_entitlement.limits.max_workspaces,
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
