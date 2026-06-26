from fastapi import APIRouter, Depends, Query, status

from app.dependencies.security import (
    get_current_host,
    require_workspace_role,
)
from app.dependencies.services import get_job_service
from app.models.host import Host
from app.models.job import JobStatus
from app.models.workspace_membership import MembershipRole, WorkspaceMembership
from app.schemas.job import (
    JobBulkDeleteRequest,
    JobBulkDeleteResponse,
    JobCreateRequest,
    JobCreateResponse,
    JobListPageResponse,
    JobResponse,
    JobUpdateRequest,
)
from app.services.job_service import JobService

router = APIRouter(tags=["jobs"])


@router.post(
    "/cli/jobs",
    response_model=JobCreateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_job(
    request: JobCreateRequest,
    current_host: Host = Depends(get_current_host),
    job_service: JobService = Depends(get_job_service),
) -> JobCreateResponse:
    """Create a new job by CLI (authenticated by host token)."""
    return job_service.create_job(current_host.workspace_id, request, current_host)


@router.patch("/cli/jobs/{job_id}", response_model=JobResponse)
def update_job(
    job_id: str,
    request: JobUpdateRequest,
    current_host: Host = Depends(get_current_host),
    job_service: JobService = Depends(get_job_service),
) -> JobResponse:
    """Update a job's status by CLI (authenticated by host token)."""
    return job_service.update_job(job_id, request, current_host)


@router.get("/workspaces/{workspace_id}/jobs", response_model=list[JobResponse])
def list_jobs_by_workspace(
    workspace_id: str,
    job_service: JobService = Depends(get_job_service),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.VIEWER)),
) -> list[JobResponse]:
    """List all jobs in a workspace."""
    return job_service.list_jobs_by_workspace(workspace_id)


@router.get(
    "/workspaces/{workspace_id}/jobs/search", response_model=JobListPageResponse
)
def search_jobs_by_workspace(
    workspace_id: str,
    job_status: JobStatus | None = Query(default=None, alias="status"),
    host_id: str | None = None,
    tag: str | None = None,
    q: str | None = None,
    limit: int = Query(default=20, ge=1, le=100),
    cursor: str | None = None,
    job_service: JobService = Depends(get_job_service),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.VIEWER)),
) -> JobListPageResponse:
    """Search jobs in a workspace with cursor pagination."""
    return job_service.search_jobs_by_workspace(
        workspace_id,
        status=job_status,
        host_id=host_id,
        tag=tag,
        q=q,
        limit=limit,
        cursor=cursor,
    )


@router.get(
    "/workspaces/{workspace_id}/hosts/{host_id}/jobs", response_model=list[JobResponse]
)
def list_jobs_by_host(
    workspace_id: str,
    host_id: str,
    job_service: JobService = Depends(get_job_service),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.VIEWER)),
) -> list[JobResponse]:
    """List all jobs for a specific host."""
    return job_service.list_jobs_by_host(workspace_id, host_id)


@router.get("/workspaces/{workspace_id}/jobs/{job_id}", response_model=JobResponse)
def get_job(
    workspace_id: str,
    job_id: str,
    job_service: JobService = Depends(get_job_service),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.VIEWER)),
) -> JobResponse:
    """Get a single job by ID."""
    return job_service.get_job_in_workspace(workspace_id, job_id)


@router.post(
    "/workspaces/{workspace_id}/jobs/bulk-delete",
    response_model=JobBulkDeleteResponse,
)
def bulk_delete_jobs(
    workspace_id: str,
    request: JobBulkDeleteRequest,
    job_service: JobService = Depends(get_job_service),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.EDITOR)),
) -> JobBulkDeleteResponse:
    """Delete multiple jobs in a workspace."""
    return job_service.delete_jobs_in_workspace(workspace_id, request.job_ids)


@router.delete(
    "/workspaces/{workspace_id}/jobs/{job_id}", status_code=status.HTTP_204_NO_CONTENT
)
def delete_job(
    workspace_id: str,
    job_id: str,
    job_service: JobService = Depends(get_job_service),
    _: WorkspaceMembership = Depends(require_workspace_role(MembershipRole.EDITOR)),
) -> None:
    """Delete a job in a workspace."""
    job_service.delete_job_in_workspace(workspace_id, job_id)
