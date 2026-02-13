from uuid import uuid4

from app.database.host_repository import HostRepository
from app.models.host import Host
from app.models.exceptions import NotFoundException
from app.schemas.host import (
    HostCreateRequest,
    HostCreateResponse,
    HostResponse,
    HostUpdateRequest,
)


class HostService:
    def __init__(self, host_repository: HostRepository) -> None:
        self._host_repository = host_repository

    def create_host(
        self,
        workspace_id: str,
        request: HostCreateRequest,
    ) -> HostCreateResponse:
        token = Host.generate_token()
        token_hash = Host.hash_token(token)
        host = Host(
            host_id=f"host-{uuid4().hex[:8]}",
            workspace_id=workspace_id,
            name=request.name,
            token_hash=token_hash,
        )
        created = self._host_repository.create(host)
        return HostCreateResponse(
            host_id=created.host_id,
            workspace_id=created.workspace_id,
            name=created.name,
            token=token,
            created_at=created.created_at,
            updated_at=created.updated_at,
        )

    def list_hosts(self, workspace_id: str) -> list[HostResponse]:
        hosts = self._host_repository.list_by_workspace(workspace_id)
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

    def get_host(self, workspace_id: str, host_id: str) -> HostResponse:
        host = self._host_repository.get(workspace_id, host_id)
        if host is None:
            raise NotFoundException(
                f"Host {host_id} not found in workspace {workspace_id}"
            )
        return HostResponse(
            host_id=host.host_id,
            workspace_id=host.workspace_id,
            name=host.name,
            created_at=host.created_at,
            updated_at=host.updated_at,
        )

    def update_host(
        self,
        workspace_id: str,
        host_id: str,
        request: HostUpdateRequest,
    ) -> HostResponse:
        host = self._host_repository.get(workspace_id, host_id)
        if host is None:
            raise NotFoundException(
                f"Host {host_id} not found in workspace {workspace_id}"
            )
        host.name = request.name
        host.touch()
        updated = self._host_repository.update(host)
        return HostResponse(
            host_id=updated.host_id,
            workspace_id=updated.workspace_id,
            name=updated.name,
            created_at=updated.created_at,
            updated_at=updated.updated_at,
        )

    def delete_host(self, workspace_id: str, host_id: str) -> None:
        host = self._host_repository.get(workspace_id, host_id)
        if host is None:
            raise NotFoundException(
                f"Host {host_id} not found in workspace {workspace_id}"
            )
        self._host_repository.delete(workspace_id, host_id)
