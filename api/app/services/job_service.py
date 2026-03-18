from uuid import uuid4

from app.database.job_repository import JobRepository
from app.models.exceptions import NotFoundException, PermissionDeniedError
from app.models.host import Host
from app.models.job import Job
from app.schemas.job import (
    JobCreateRequest,
    JobCreateResponse,
    JobResponse,
    JobUpdateRequest,
)
from app.utils.datetime import now


class JobService:
    def __init__(self, job_repository: JobRepository) -> None:
        self._job_repository = job_repository

    def create_job(
        self,
        workspace_id: str,
        request: JobCreateRequest,
        current_host: Host,
    ) -> JobCreateResponse:
        if current_host.workspace_id != workspace_id:
            raise PermissionDeniedError("Host does not belong to this workspace")
        job = Job(
            job_id=f"job-{uuid4().hex[:8]}",
            workspace_id=workspace_id,
            host_id=current_host.host_id,
            status=request.status,
            command=request.command,
            tags=request.tags,
            created_at=now(),
            started_at=request.started_at,
        )
        created = self._job_repository.create(job)
        return JobCreateResponse(
            job_id=created.job_id,
        )

    def list_jobs_by_workspace(self, workspace_id: str) -> list[JobResponse]:
        jobs = list(self._job_repository.list_by_workspace(workspace_id))
        jobs.sort(
            key=lambda job: (job.started_at, job.created_at),
            reverse=True,
        )
        return [
            JobResponse(
                job_id=job.job_id,
                workspace_id=job.workspace_id,
                host_id=job.host_id,
                command=job.command,
                tags=job.tags,
                status=job.status,
                tail_lines=job.tail_lines,
                started_at=job.started_at,
                finished_at=job.finished_at,
            )
            for job in jobs
        ]

    def list_jobs_by_host(self, workspace_id: str, host_id: str) -> list[JobResponse]:
        jobs = list(self._job_repository.list_by_host(workspace_id, host_id))
        jobs.sort(
            key=lambda job: (job.started_at, job.created_at),
            reverse=True,
        )
        return [
            JobResponse(
                job_id=job.job_id,
                workspace_id=job.workspace_id,
                host_id=job.host_id,
                command=job.command,
                tags=job.tags,
                status=job.status,
                tail_lines=job.tail_lines,
                started_at=job.started_at,
                finished_at=job.finished_at,
            )
            for job in jobs
        ]

    def get_job(self, job_id: str) -> JobResponse:
        job = self._job_repository.get(job_id)
        if job is None:
            raise NotFoundException(f"Job {job_id} not found")
        return JobResponse(
            job_id=job.job_id,
            workspace_id=job.workspace_id,
            host_id=job.host_id,
            command=job.command,
            tags=job.tags,
            status=job.status,
            tail_lines=job.tail_lines,
            started_at=job.started_at,
            finished_at=job.finished_at,
        )

    def get_job_in_workspace(self, workspace_id: str, job_id: str) -> JobResponse:
        job = self._job_repository.get(job_id)
        if job is None or job.workspace_id != workspace_id:
            raise NotFoundException(
                f"Job {job_id} not found in workspace {workspace_id}"
            )
        return JobResponse(
            job_id=job.job_id,
            workspace_id=job.workspace_id,
            host_id=job.host_id,
            command=job.command,
            tags=job.tags,
            status=job.status,
            tail_lines=job.tail_lines,
            started_at=job.started_at,
            finished_at=job.finished_at,
        )

    def update_job(
        self,
        job_id: str,
        request: JobUpdateRequest,
        current_host: Host,
    ) -> JobResponse:
        job = self._job_repository.get(job_id)
        if job is None:
            raise NotFoundException(f"Job {job_id} not found")
        if job.host_id != current_host.host_id:
            raise PermissionDeniedError("This job does not belong to your host")
        if request.status is not None:
            job.status = request.status
        if request.tail_lines:
            job.tail_lines = request.tail_lines
        if request.finished_at is not None:
            job.finished_at = request.finished_at
        updated = self._job_repository.update(job)
        return JobResponse(
            job_id=updated.job_id,
            workspace_id=updated.workspace_id,
            host_id=updated.host_id,
            command=updated.command,
            tags=updated.tags,
            status=updated.status,
            tail_lines=updated.tail_lines,
            started_at=updated.started_at,
            finished_at=updated.finished_at,
        )

    def delete_job(self, job_id: str, current_host: Host) -> None:
        job = self._job_repository.get(job_id)
        if job is None:
            raise NotFoundException(f"Job {job_id} not found")
        if job.host_id != current_host.host_id:
            raise PermissionDeniedError("This job does not belong to your host")
        self._job_repository.delete(job)

    def delete_job_in_workspace(self, workspace_id: str, job_id: str) -> None:
        job = self._job_repository.get(job_id)
        if job is None or job.workspace_id != workspace_id:
            raise NotFoundException(
                f"Job {job_id} not found in workspace {workspace_id}"
            )
        self._job_repository.delete(job)
