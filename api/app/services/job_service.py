from uuid import uuid4

from app.database.job_repository import JobRepository
from app.models.exceptions import (
    BadRequestException,
    NotFoundException,
    PermissionDeniedError,
)
from app.models.host import Host
from app.models.job import Job, JobStatus
from app.schemas.job import (
    JobBulkDeleteResponse,
    JobCreateRequest,
    JobCreateResponse,
    JobListPageResponse,
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
            status=JobStatus.RUNNING,
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

    def search_jobs_by_workspace(
        self,
        workspace_id: str,
        status: JobStatus | None,
        host_id: str | None,
        tag: str | None,
        q: str | None,
        limit: int,
        cursor: str | None,
    ) -> JobListPageResponse:
        jobs = list(self._job_repository.list_by_workspace(workspace_id))
        normalized_tag = tag.strip().lower() if tag else None
        normalized_q = q.strip().lower() if q else None

        if status is not None:
            jobs = [job for job in jobs if job.status == status]
        if host_id:
            jobs = [job for job in jobs if job.host_id == host_id]
        if normalized_tag:
            jobs = [
                job
                for job in jobs
                if any(job_tag.lower() == normalized_tag for job_tag in job.tags)
            ]
        if normalized_q:
            jobs = [
                job
                for job in jobs
                if normalized_q in job.command.lower()
                or normalized_q in job.job_id.lower()
                or normalized_q in job.host_id.lower()
            ]

        jobs.sort(
            key=lambda job: (job.started_at, job.created_at),
            reverse=True,
        )
        total_count = len(jobs)
        offset = self._decode_cursor(cursor)
        page_jobs = jobs[offset : offset + limit]
        next_offset = offset + len(page_jobs)
        next_cursor = str(next_offset) if next_offset < total_count else None

        return JobListPageResponse(
            items=[self._to_response(job) for job in page_jobs],
            next_cursor=next_cursor,
            total_count=total_count,
        )

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
        if request.tail_lines is not None:
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

    def delete_jobs_in_workspace(
        self, workspace_id: str, job_ids: list[str]
    ) -> JobBulkDeleteResponse:
        jobs: list[Job] = []
        for job_id in dict.fromkeys(job_ids):
            job = self._job_repository.get(job_id)
            if job is None or job.workspace_id != workspace_id:
                raise NotFoundException(
                    f"Job {job_id} not found in workspace {workspace_id}"
                )
            jobs.append(job)

        self._job_repository.delete_many(jobs)
        return JobBulkDeleteResponse(deleted_count=len(jobs))

    @staticmethod
    def _decode_cursor(cursor: str | None) -> int:
        if cursor is None:
            return 0
        try:
            return max(0, int(cursor))
        except ValueError as exc:
            raise BadRequestException("Invalid jobs page cursor") from exc

    @staticmethod
    def _to_response(job: Job) -> JobResponse:
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
