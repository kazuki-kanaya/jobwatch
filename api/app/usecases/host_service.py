from typing import Iterable

from app.domain.host import Host
from app.ports.host_repository import HostRepository


class HostService:
    def __init__(self, host_repository: HostRepository) -> None:
        self._host_repository = host_repository

    def create(self, host: Host) -> Host:
        return self._host_repository.create(host)

    def get(self, workspace_id: str, host_id: str) -> Host | None:
        return self._host_repository.get(workspace_id, host_id)

    def find_by_token_hash(self, token_hash: str) -> Host | None:
        return self._host_repository.find_by_token_hash(token_hash)

    def list_by_workspace(self, workspace_id: str) -> Iterable[Host]:
        return self._host_repository.list_by_workspace(workspace_id)

    def update(self, host: Host) -> Host:
        return self._host_repository.update(host)

    def delete(self, host: Host) -> None:
        self._host_repository.delete(host)
