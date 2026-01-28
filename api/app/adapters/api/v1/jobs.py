from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status

from app.adapters.api.deps import get_current_host, get_job_service
from app.adapters.api.schemas.job import (
    JobCreateRequest,
    JobResponse,
    JobUpdateRequest,
)
from app.domain.host import Host
from app.domain.job import Job, JobStatus
from app.usecases.job_service import JobService

job_router = APIRouter(prefix="/jobs", tags=["jobs"])


@job_router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    request: JobCreateRequest,
    current_host: Host = Depends(get_current_host),
    job_service: JobService = Depends(get_job_service),
) -> JobResponse:
    """Create a new job (requires host token authentication)."""
    now = datetime.now(timezone.utc)
    job = Job(
        id=f"job-{uuid4().hex[:8]}",
        workspace_id=current_host.workspace_id,
        host_id=current_host.id,
        status=JobStatus.RUNNING,
        project=request.project,
        command=request.command,
        args=request.args,
        tags=request.tags,
        created_at=now,
        started_at=request.started_at,
    )

    created_job = job_service.create(job)

    return JobResponse(
        id=created_job.id,
        project=created_job.project,
        command=created_job.command,
        args=created_job.args,
        tags=created_job.tags,
        status=created_job.status,
        err=created_job.err,
        tail_lines=created_job.tail_lines,
        started_at=created_job.started_at or now,
        finished_at=created_job.finished_at,
    )


@job_router.patch("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: str,
    request: JobUpdateRequest,
    current_host: Host = Depends(get_current_host),
    job_service: JobService = Depends(get_job_service),
) -> JobResponse:
    """Update job status (requires host token authentication)."""
    job = job_service.get(current_host.workspace_id, current_host.id, job_id)
    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {job_id} not found",
        )

    if job.host_id != current_host.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own jobs",
        )

    if request.status is not None:
        job.status = request.status
    if request.err is not None:
        job.err = request.err
    if request.tail_lines is not None:
        job.tail_lines = request.tail_lines
    if request.finished_at is not None:
        job.finished_at = request.finished_at

    updated_job = job_service.update(job)

    return JobResponse(
        id=updated_job.id,
        project=updated_job.project,
        command=updated_job.command,
        args=updated_job.args,
        tags=updated_job.tags,
        status=updated_job.status,
        err=updated_job.err,
        tail_lines=updated_job.tail_lines,
        started_at=updated_job.started_at,
        finished_at=updated_job.finished_at,
    )


@job_router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: str,
    current_host: Host = Depends(get_current_host),
    job_service: JobService = Depends(get_job_service),
) -> JobResponse:
    """Get job details (requires host token authentication, owner verification)."""
    job = job_service.get(current_host.workspace_id, current_host.id, job_id)
    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {job_id} not found",
        )

    if job.host_id != current_host.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own jobs",
        )

    return JobResponse(
        id=job.id,
        project=job.project,
        command=job.command,
        args=job.args,
        tags=job.tags,
        status=job.status,
        err=job.err,
        tail_lines=job.tail_lines,
        started_at=job.started_at or datetime.now(timezone.utc),
        finished_at=job.finished_at,
    )
