from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status

from app.adapters.api.deps import get_workspace_service
from app.adapters.api.schemas.workspace import (
    WorkspaceCreateRequest,
    WorkspaceResponse,
    WorkspaceUpdateRequest,
)
from app.domain.workspace import Workspace
from app.usecases.workspace_service import WorkspaceService

workspace_router = APIRouter(prefix="/workspaces", tags=["workspaces"])


@workspace_router.post(
    "", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED
)
def create_workspace(
    request: WorkspaceCreateRequest,
    workspace_service: WorkspaceService = Depends(get_workspace_service),
) -> WorkspaceResponse:
    """Create a new workspace."""
    now = datetime.now(timezone.utc)
    workspace = Workspace(
        workspace_id=f"workspace-{uuid4().hex[:8]}",
        name=request.name,
        created_at=now,
        updated_at=now,
    )

    created_workspace = workspace_service.create(workspace)

    return WorkspaceResponse(
        workspace_id=created_workspace.workspace_id,
        name=created_workspace.name,
        created_at=created_workspace.created_at,
        updated_at=created_workspace.updated_at,
    )


@workspace_router.get("/{workspace_id}", response_model=WorkspaceResponse)
def get_workspace(
    workspace_id: str,
    workspace_service: WorkspaceService = Depends(get_workspace_service),
) -> WorkspaceResponse:
    """Get a single workspace by ID."""
    workspace = workspace_service.get(workspace_id)
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


@workspace_router.patch("/{workspace_id}", response_model=WorkspaceResponse)
def update_workspace(
    workspace_id: str,
    request: WorkspaceUpdateRequest,
    workspace_service: WorkspaceService = Depends(get_workspace_service),
) -> WorkspaceResponse:
    """Update a workspace's information."""
    workspace = workspace_service.get(workspace_id)
    if workspace is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workspace {workspace_id} not found",
        )

    workspace.name = request.name
    workspace.updated_at = datetime.now(timezone.utc)

    updated_workspace = workspace_service.update(workspace)

    return WorkspaceResponse(
        workspace_id=updated_workspace.workspace_id,
        name=updated_workspace.name,
        created_at=updated_workspace.created_at,
        updated_at=updated_workspace.updated_at,
    )


@workspace_router.delete("/{workspace_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workspace(
    workspace_id: str,
    workspace_service: WorkspaceService = Depends(get_workspace_service),
) -> None:
    """Delete a workspace and all its associated resources."""
    workspace = workspace_service.get(workspace_id)
    if workspace is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workspace {workspace_id} not found",
        )

    workspace_service.delete(workspace)
