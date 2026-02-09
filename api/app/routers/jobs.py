from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status

from app.database.job_repository import JobRepository
from app.models.host import Host
from app.models.job import Job, JobStatus
from app.schemas.job import JobCreateRequest, JobResponse, JobUpdateRequest
from app.dependencies import get_current_host, get_job_repository

router = APIRouter(tags=["jobs"])


@router.post(
    "/workspaces/{workspace_id}/jobs",
    response_model=JobResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_job(
    workspace_id: str,
    request: JobCreateRequest,
    current_host: Host = Depends(get_current_host),
    repository: JobRepository = Depends(get_job_repository),
) -> JobResponse:
    """Create a new job (authenticated by host token)."""
    if current_host.workspace_id != workspace_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Host does not belong to this workspace",
        )

    now = datetime.now(timezone.utc)
    job = Job(
        job_id=f"job-{uuid4().hex[:8]}",
        workspace_id=workspace_id,
        host_id=current_host.host_id,
        status=JobStatus.RUNNING,
        project=request.project,
        command=request.command,
        args=request.args,
        tags=request.tags,
        created_at=now,
        started_at=request.started_at,
    )

    created = repository.create(job)

    return JobResponse(
        job_id=created.job_id,
        project=created.project,
        command=created.command,
        args=created.args,
        tags=created.tags,
        status=created.status,
        err=created.err,
        tail_lines=created.tail_lines,
        started_at=created.started_at,
        finished_at=created.finished_at,
    )


@router.get("/workspaces/{workspace_id}/jobs", response_model=list[JobResponse])
def list_jobs_by_workspace(
    workspace_id: str,
    repository: JobRepository = Depends(get_job_repository),
) -> list[JobResponse]:
    """List all jobs in a workspace."""
    jobs = repository.list_by_workspace(workspace_id)
    return [
        JobResponse(
            job_id=job.job_id,
            project=job.project,
            command=job.command,
            args=job.args,
            tags=job.tags,
            status=job.status,
            err=job.err,
            tail_lines=job.tail_lines,
            started_at=job.started_at,
            finished_at=job.finished_at,
        )
        for job in jobs
    ]


@router.get(
    "/workspaces/{workspace_id}/hosts/{host_id}/jobs", response_model=list[JobResponse]
)
def list_jobs_by_host(
    workspace_id: str,
    host_id: str,
    repository: JobRepository = Depends(get_job_repository),
) -> list[JobResponse]:
    """List all jobs for a specific host."""
    jobs = repository.list_by_host(workspace_id, host_id)
    return [
        JobResponse(
            job_id=job.job_id,
            project=job.project,
            command=job.command,
            args=job.args,
            tags=job.tags,
            status=job.status,
            err=job.err,
            tail_lines=job.tail_lines,
            started_at=job.started_at,
            finished_at=job.finished_at,
        )
        for job in jobs
    ]


@router.get("/jobs/{job_id}", response_model=JobResponse)
def get_job(
    job_id: str,
    repository: JobRepository = Depends(get_job_repository),
) -> JobResponse:
    """Get a single job by ID."""
    job = repository.get(job_id)
    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {job_id} not found",
        )

    return JobResponse(
        job_id=job.job_id,
        project=job.project,
        command=job.command,
        args=job.args,
        tags=job.tags,
        status=job.status,
        err=job.err,
        tail_lines=job.tail_lines,
        started_at=job.started_at,
        finished_at=job.finished_at,
    )


@router.patch("/jobs/{job_id}", response_model=JobResponse)
def update_job(
    job_id: str,
    request: JobUpdateRequest,
    current_host: Host = Depends(get_current_host),
    repository: JobRepository = Depends(get_job_repository),
) -> JobResponse:
    """Update a job's status (authenticated by host token)."""
    job = repository.get(job_id)
    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {job_id} not found",
        )

    if job.host_id != current_host.host_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This job does not belong to your host",
        )

    if request.status is not None:
        job.status = request.status
    if request.err is not None:
        job.err = request.err
    if request.tail_lines:
        job.tail_lines = request.tail_lines
    if request.finished_at is not None:
        job.finished_at = request.finished_at

    updated = repository.update(job)

    return JobResponse(
        job_id=updated.job_id,
        project=updated.project,
        command=updated.command,
        args=updated.args,
        tags=updated.tags,
        status=updated.status,
        err=updated.err,
        tail_lines=updated.tail_lines,
        started_at=updated.started_at,
        finished_at=updated.finished_at,
    )


@router.delete("/jobs/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: str,
    current_host: Host = Depends(get_current_host),
    repository: JobRepository = Depends(get_job_repository),
) -> None:
    """Delete a job (authenticated by host token)."""
    job = repository.get(job_id)
    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {job_id} not found",
        )

    if job.host_id != current_host.host_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This job does not belong to your host",
        )

    repository.delete(job)
