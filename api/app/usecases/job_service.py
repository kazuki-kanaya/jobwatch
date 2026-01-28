from typing import Iterable

from app.domain.job import Job
from app.ports.job_repository import JobRepository


class JobService:
    def __init__(self, job_repository: JobRepository):
        self._job_repository = job_repository

    def create(self, job: Job) -> Job:
        return self._job_repository.create(job)

    def get(self, job_id: str) -> Job | None:
        return self._job_repository.get(job_id)

    def list_by_host(self, workspace_id: str, host_id: str) -> Iterable[Job]:
        return self._job_repository.list_by_host(workspace_id, host_id)

    def list_by_workspace(self, workspace_id: str) -> Iterable[Job]:
        return self._job_repository.list_by_workspace(workspace_id)

    def update(self, job: Job) -> Job:
        return self._job_repository.update(job)

    def delete(self, job: Job) -> None:
        self._job_repository.delete(job)
