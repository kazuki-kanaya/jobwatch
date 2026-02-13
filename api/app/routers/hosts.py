from fastapi import APIRouter, Depends, status

from app.dependencies.security import require_workspace_role
from app.dependencies.services import get_host_service
from app.models.workspace_membership import MembershipRole, WorkspaceMembership
from app.schemas.host import (
    HostCreateRequest,
    HostCreateResponse,
    HostResponse,
    HostUpdateRequest,
)
from app.services.host_service import HostService

router = APIRouter(prefix="/workspaces/{workspace_id}/hosts", tags=["hosts"])


@router.post("", response_model=HostCreateResponse, status_code=status.HTTP_201_CREATED)
def create_host(
    workspace_id: str,
    request: HostCreateRequest,
    host_service: HostService = Depends(get_host_service),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.EDITOR)),
) -> HostCreateResponse:
    """Create a new host and return authentication token (one-time display)."""
    return host_service.create_host(workspace_id, request)


@router.get("", response_model=list[HostResponse])
def list_hosts(
    workspace_id: str,
    host_service: HostService = Depends(get_host_service),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.VIEWER)),
) -> list[HostResponse]:
    """List all hosts in a workspace."""
    return host_service.list_hosts(workspace_id)


@router.get("/{host_id}", response_model=HostResponse)
def get_host(
    workspace_id: str,
    host_id: str,
    host_service: HostService = Depends(get_host_service),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.VIEWER)),
) -> HostResponse:
    """Get a single host by ID."""
    return host_service.get_host(workspace_id, host_id)


@router.patch("/{host_id}", response_model=HostResponse)
def update_host(
    workspace_id: str,
    host_id: str,
    request: HostUpdateRequest,
    host_service: HostService = Depends(get_host_service),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.EDITOR)),
) -> HostResponse:
    """Update a host's information."""
    return host_service.update_host(workspace_id, host_id, request)


@router.delete("/{host_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_host(
    workspace_id: str,
    host_id: str,
    host_service: HostService = Depends(get_host_service),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.EDITOR)),
) -> None:
    """Delete a host and all its associated jobs."""
    host_service.delete_host(workspace_id, host_id)
