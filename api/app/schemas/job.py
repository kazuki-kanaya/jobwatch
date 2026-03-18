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
