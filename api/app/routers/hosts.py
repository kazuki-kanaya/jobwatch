from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status

from app.database.host_repository import HostRepository
from app.models.host import Host
from app.schemas.host import (
    HostCreateRequest,
    HostCreateResponse,
    HostResponse,
    HostUpdateRequest,
)
from app.dependencies import get_host_repository

router = APIRouter(prefix="/workspaces/{workspace_id}/hosts", tags=["hosts"])


@router.post("", response_model=HostCreateResponse, status_code=status.HTTP_201_CREATED)
def create_host(
    workspace_id: str,
    request: HostCreateRequest,
    repository: HostRepository = Depends(get_host_repository),
) -> HostCreateResponse:
    """Create a new host and return authentication token (one-time display)."""
    token = Host.generate_token()
    token_hash = Host.hash_token(token)

    now = datetime.now(timezone.utc)
    host = Host(
        host_id=f"host-{uuid4().hex[:8]}",
        workspace_id=workspace_id,
        name=request.name,
        token_hash=token_hash,
        created_at=now,
        updated_at=now,
    )

    created = repository.create(host)

    return HostCreateResponse(
        host_id=created.host_id,
        workspace_id=created.workspace_id,
        name=created.name,
        token=token,
        created_at=created.created_at,
    )


@router.get("", response_model=list[HostResponse])
def list_hosts(
    workspace_id: str,
    repository: HostRepository = Depends(get_host_repository),
) -> list[HostResponse]:
    """List all hosts in a workspace."""
    hosts = repository.list_by_workspace(workspace_id)
    return [
        HostResponse(
            host_id=host.host_id,
            workspace_id=host.workspace_id,
            name=host.name,
            created_at=host.created_at,
            updated_at=host.updated_at,
        )
        for host in hosts
    ]


@router.get("/{host_id}", response_model=HostResponse)
def get_host(
    workspace_id: str,
    host_id: str,
    repository: HostRepository = Depends(get_host_repository),
) -> HostResponse:
    """Get a single host by ID."""
    host = repository.get(workspace_id, host_id)
    if host is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Host {host_id} not found in workspace {workspace_id}",
        )

    return HostResponse(
        host_id=host.host_id,
        workspace_id=host.workspace_id,
        name=host.name,
        created_at=host.created_at,
        updated_at=host.updated_at,
    )


@router.patch("/{host_id}", response_model=HostResponse)
def update_host(
    workspace_id: str,
    host_id: str,
    request: HostUpdateRequest,
    repository: HostRepository = Depends(get_host_repository),
) -> HostResponse:
    """Update a host's information."""
    host = repository.get(workspace_id, host_id)
    if host is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Host {host_id} not found in workspace {workspace_id}",
        )

    host.name = request.name
    host.updated_at = datetime.now(timezone.utc)

    updated = repository.update(host)

    return HostResponse(
        host_id=updated.host_id,
        workspace_id=updated.workspace_id,
        name=updated.name,
        created_at=updated.created_at,
        updated_at=updated.updated_at,
    )


@router.delete("/{host_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_host(
    workspace_id: str,
    host_id: str,
    repository: HostRepository = Depends(get_host_repository),
) -> None:
    """Delete a host and all its associated jobs."""
    host = repository.get(workspace_id, host_id)
    if host is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Host {host_id} not found in workspace {workspace_id}",
        )

    repository.delete(workspace_id, host_id)
