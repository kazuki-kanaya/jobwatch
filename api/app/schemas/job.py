from datetime import datetime

from pydantic import BaseModel, Field

from app.models.job import JobStatus


class JobCreateRequest(BaseModel):
    command: str
    tags: list[str] = Field(default_factory=list)
    started_at: datetime


class JobUpdateRequest(BaseModel):
    status: JobStatus | None = None
    tail_lines: list[str] | None = None
    finished_at: datetime | None = None


class JobCreateResponse(BaseModel):
    job_id: str


class JobResponse(BaseModel):
    job_id: str
    workspace_id: str
    host_id: str
    command: str
    tags: list[str] = Field(default_factory=list)
    status: JobStatus
    tail_lines: list[str] = Field(default_factory=list)
    started_at: datetime
    finished_at: datetime | None = None


class JobListPageResponse(BaseModel):
    items: list[JobResponse]
    next_cursor: str | None = None
    total_count: int


class JobBulkDeleteRequest(BaseModel):
    job_ids: list[str] = Field(min_length=1, max_length=100)


class JobBulkDeleteResponse(BaseModel):
    deleted_count: int
