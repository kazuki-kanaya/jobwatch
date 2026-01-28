from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status

from app.adapters.api.deps import get_host_service
from app.adapters.api.schemas.host import (
    HostCreateRequest,
    HostCreateResponse,
    HostResponse,
    HostUpdateRequest,
)
from app.domain.host import Host
from app.usecases.host_service import HostService

host_router = APIRouter(prefix="/workspaces/{workspace_id}/hosts", tags=["hosts"])


@host_router.post(
    "", response_model=HostCreateResponse, status_code=status.HTTP_201_CREATED
)
def create_host(
    workspace_id: str,
    request: HostCreateRequest,
    host_service: HostService = Depends(get_host_service),
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

    created_host = host_service.create(host)

    return HostCreateResponse(
        host_id=created_host.host_id,
        workspace_id=created_host.workspace_id,
        name=created_host.name,
        token=token,
        created_at=created_host.created_at,
    )


@host_router.get("", response_model=list[HostResponse])
def list_hosts(
    workspace_id: str,
    host_service: HostService = Depends(get_host_service),
) -> list[HostResponse]:
    """List all hosts in a workspace."""
    hosts = host_service.list_by_workspace(workspace_id)
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


@host_router.get("/{host_id}", response_model=HostResponse)
def get_host(
    workspace_id: str,
    host_id: str,
    host_service: HostService = Depends(get_host_service),
) -> HostResponse:
    """Get a single host by ID."""
    host = host_service.get(workspace_id, host_id)
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


@host_router.patch("/{host_id}", response_model=HostResponse)
def update_host(
    workspace_id: str,
    host_id: str,
    request: HostUpdateRequest,
    host_service: HostService = Depends(get_host_service),
) -> HostResponse:
    """Update a host's information."""
    host = host_service.get(workspace_id, host_id)
    if host is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Host {host_id} not found in workspace {workspace_id}",
        )

    host.name = request.name
    host.updated_at = datetime.now(timezone.utc)

    updated_host = host_service.update(host)

    return HostResponse(
        host_id=updated_host.host_id,
        workspace_id=updated_host.workspace_id,
        name=updated_host.name,
        created_at=updated_host.created_at,
        updated_at=updated_host.updated_at,
    )


@host_router.delete("/{host_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_host(
    workspace_id: str,
    host_id: str,
    host_service: HostService = Depends(get_host_service),
) -> None:
    """Delete a host and all its associated jobs."""
    host = host_service.get(workspace_id, host_id)
    if host is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Host {host_id} not found in workspace {workspace_id}",
        )

    host_service.delete(host)
