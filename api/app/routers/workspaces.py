from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status

from app.database.workspace_repository import WorkspaceRepository
from app.models.workspace import Workspace
from app.schemas.workspace import (
    WorkspaceCreateRequest,
    WorkspaceResponse,
    WorkspaceUpdateRequest,
)
from app.dependencies import get_workspace_repository

router = APIRouter(prefix="/workspaces", tags=["workspaces"])


@router.post("", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED)
def create_workspace(
    request: WorkspaceCreateRequest,
    repository: WorkspaceRepository = Depends(get_workspace_repository),
) -> WorkspaceResponse:
    """Create a new workspace."""
    now = datetime.now(timezone.utc)
    workspace = Workspace(
        workspace_id=f"workspace-{uuid4().hex[:8]}",
        name=request.name,
        created_at=now,
        updated_at=now,
    )

    created = repository.create(workspace)

    return WorkspaceResponse(
        workspace_id=created.workspace_id,
        name=created.name,
        created_at=created.created_at,
        updated_at=created.updated_at,
    )


@router.get("/{workspace_id}", response_model=WorkspaceResponse)
def get_workspace(
    workspace_id: str,
    repository: WorkspaceRepository = Depends(get_workspace_repository),
) -> WorkspaceResponse:
    """Get a single workspace by ID."""
    workspace = repository.get(workspace_id)
    if workspace is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workspace {workspace_id} not found",
        )

    return WorkspaceResponse(
        workspace_id=workspace.workspace_id,
        name=workspace.name,
        created_at=workspace.created_at,
        updated_at=workspace.updated_at,
    )


@router.patch("/{workspace_id}", response_model=WorkspaceResponse)
def update_workspace(
    workspace_id: str,
    request: WorkspaceUpdateRequest,
    repository: WorkspaceRepository = Depends(get_workspace_repository),
) -> WorkspaceResponse:
    """Update a workspace's information."""
    workspace = repository.get(workspace_id)
    if workspace is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workspace {workspace_id} not found",
        )

    workspace.name = request.name
    workspace.updated_at = datetime.now(timezone.utc)

    updated = repository.update(workspace)

    return WorkspaceResponse(
        workspace_id=updated.workspace_id,
        name=updated.name,
        created_at=updated.created_at,
        updated_at=updated.updated_at,
    )


@router.delete("/{workspace_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workspace(
    workspace_id: str,
    repository: WorkspaceRepository = Depends(get_workspace_repository),
) -> None:
    """Delete a workspace and all its associated resources."""
    workspace = repository.get(workspace_id)
    if workspace is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workspace {workspace_id} not found",
        )

    repository.delete(workspace)
