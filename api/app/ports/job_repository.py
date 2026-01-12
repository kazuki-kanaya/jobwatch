from typing import Iterable, Protocol

from app.domain.job import Job, JobCreate, JobId, JobQuery, JobUpdate


class JobRepository(Protocol):
    def create(self, payload: JobCreate) -> Job:
        raise NotImplementedError

    def get(self, job_id: JobId) -> Job | None:
        raise NotImplementedError

    def list(self, query: JobQuery) -> Iterable[Job]:
        raise NotImplementedError

    def update(self, job_id: JobId, payload: JobUpdate) -> Job | None:
        raise NotImplementedError

    def delete(self, job_id: JobId) -> None:
        raise NotImplementedError
