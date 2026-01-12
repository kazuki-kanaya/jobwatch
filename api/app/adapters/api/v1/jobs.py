from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.adapters.api.deps import get_job_service
from app.adapters.api.schemas.job import JobCreateRequest, JobResponse, JobUpdateRequest
from app.domain.job import JobCreate, JobStatus, JobUpdate
from app.usecases.job_service import JobService

jobs_router = APIRouter(prefix="/jobs", tags=["jobs"])


@jobs_router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(
    payload: JobCreateRequest,
    service: JobService = Depends(get_job_service),
) -> JobResponse:
    job_create = JobCreate.model_validate(payload)
    return JobResponse.model_validate(service.create_job(job_create))


@jobs_router.get("", response_model=list[JobResponse])
async def list_jobs(
    status: JobStatus | None = Query(default=None),
    project: str | None = Query(default=None),
    tag: str | None = Query(default=None),
    service: JobService = Depends(get_job_service),
) -> list[JobResponse]:
    jobs = service.list_jobs(status=status, project=project, tag=tag)
    return [JobResponse.model_validate(job) for job in jobs]


@jobs_router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: str,
    service: JobService = Depends(get_job_service),
) -> JobResponse:
    job = service.get_job(job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return JobResponse.model_validate(job)


@jobs_router.patch("/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: str,
    payload: JobUpdateRequest,
    service: JobService = Depends(get_job_service),
) -> JobResponse:
    job_update = JobUpdate.model_validate(payload)
    job = service.update_job(job_id, job_update)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return JobResponse.model_validate(job)


@jobs_router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(
    job_id: str,
    service: JobService = Depends(get_job_service),
) -> None:
    job = service.get_job(job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    service.delete_job(job_id)
