from typing import Iterable

from app.domain.job import Job, JobCreate, JobId, JobQuery, JobStatus, JobUpdate
from app.ports.job_repository import JobRepository


class JobService:
    def __init__(self, repo: JobRepository) -> None:
        self._repo = repo

    def create_job(self, payload: JobCreate) -> Job:
        return self._repo.create(payload)

    def get_job(self, job_id: JobId) -> Job | None:
        return self._repo.get(job_id)

    def list_jobs(
        self,
        *,
        status: JobStatus | None = None,
        project: str | None = None,
        tag: str | None = None,
    ) -> Iterable[Job]:
        return self._repo.list(JobQuery(status=status, project=project, tag=tag))

    def update_job(self, job_id: JobId, payload: JobUpdate) -> Job | None:
        return self._repo.update(job_id, payload)

    def delete_job(self, job_id: JobId) -> None:
        self._repo.delete(job_id)
