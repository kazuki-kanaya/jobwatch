from app.database.workspace_membership_repository import WorkspaceMembershipRepository
from app.database.workspace_repository import WorkspaceRepository
from app.models.user import User
from app.schemas.user import UserResponse, UserWorkspacesResponse
from app.schemas.workspace import WorkspaceResponse


class UserService:
    def __init__(
        self,
        workspace_repository: WorkspaceRepository,
        workspace_membership_repository: WorkspaceMembershipRepository,
    ) -> None:
        self._workspace_repository = workspace_repository
        self._workspace_membership_repository = workspace_membership_repository

    def read_current_user(self, current_user: User) -> UserResponse:
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
