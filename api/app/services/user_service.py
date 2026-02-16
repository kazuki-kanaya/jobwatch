from app.database.user_repository import UserRepository
from app.database.workspace_membership_repository import WorkspaceMembershipRepository
from app.database.workspace_repository import WorkspaceRepository
from app.models.user import User
from app.schemas.user import (
    UserLookupResponse,
    UserResponse,
    UserUpdateRequest,
    UserWorkspacesResponse,
)
from app.schemas.workspace import WorkspaceResponse


class UserService:
    def __init__(
        self,
        user_repository: UserRepository,
        workspace_repository: WorkspaceRepository,
        workspace_membership_repository: WorkspaceMembershipRepository,
    ) -> None:
        self._user_repository = user_repository
        self._workspace_repository = workspace_repository
        self._workspace_membership_repository = workspace_membership_repository

    def read_current_user(self, current_user: User) -> UserResponse:
        return UserResponse(
            user_id=current_user.user_id,
            name=current_user.name,
            created_at=current_user.created_at,
            updated_at=current_user.updated_at,
        )

    def update_current_user(
        self, current_user: User, request: UserUpdateRequest
    ) -> UserResponse:
        if current_user.name != request.name:
            current_user.name = request.name
            current_user.touch()
            current_user = self._user_repository.update(current_user)

        return UserResponse(
            user_id=current_user.user_id,
            name=current_user.name,
            created_at=current_user.created_at,
            updated_at=current_user.updated_at,
        )

    def list_user_workspaces(self, current_user: User) -> UserWorkspacesResponse:
        workspace_memberships = self._workspace_membership_repository.list_by_user(
            current_user.user_id
        )
        workspace_ids = {
            membership.workspace_id for membership in workspace_memberships
        }
        workspaces = self._workspace_repository.get_many(workspace_ids)
        workspaces.sort(key=lambda workspace: workspace.created_at, reverse=True)
        workspace_responses = [
            WorkspaceResponse(
                workspace_id=workspace.workspace_id,
                name=workspace.name,
                created_at=workspace.created_at,
                updated_at=workspace.updated_at,
            )
            for workspace in workspaces
        ]
        return UserWorkspacesResponse(workspaces=workspace_responses)

    def lookup_users(self, user_ids: list[str]) -> UserLookupResponse:
        normalized_user_ids = [
            user_id.strip() for user_id in user_ids if user_id.strip()
        ]
        users = self._user_repository.get_many(normalized_user_ids)
        user_map = {user.user_id: user for user in users}

        response_users: list[UserResponse] = []
        not_found_user_ids: list[str] = []
        seen: set[str] = set()

        for user_id in normalized_user_ids:
            if user_id in seen:
                continue
            seen.add(user_id)
            user = user_map.get(user_id)
            if user is None:
                not_found_user_ids.append(user_id)
                continue
            response_users.append(
                UserResponse(
                    user_id=user.user_id,
                    name=user.name,
                    created_at=user.created_at,
                    updated_at=user.updated_at,
                )
            )

        return UserLookupResponse(
            users=response_users, not_found_user_ids=not_found_user_ids
        )
