from app.domain.workspace import Workspace
from app.ports.workspace_repository import WorkspaceRepository


class WorkspaceService:
    def __init__(self, workspace_repository: WorkspaceRepository):
        self._workspace_repository = workspace_repository

    def create(self, workspace: Workspace) -> Workspace:
        return self._workspace_repository.create(workspace)

    def get(self, workspace_id: str) -> Workspace | None:
        return self._workspace_repository.get(workspace_id)

    def update(self, workspace: Workspace) -> Workspace:
        return self._workspace_repository.update(workspace)

    def delete(self, workspace: Workspace) -> None:
        self._workspace_repository.delete(workspace)
