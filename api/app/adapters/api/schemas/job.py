from datetime import datetime

from pydantic import BaseModel, Field

from app.domain.job import JobStatus


class JobCreateRequest(BaseModel):
    project: str
    command: str
    args: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    started_at: datetime


class JobUpdateRequest(BaseModel):
    status: JobStatus | None = None
    err: str | None = None
    tail_lines: list[str] = Field(default_factory=list)
    finished_at: datetime | None = None


class JobResponse(BaseModel):
    id: str
    project: str
    command: str
    args: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    status: JobStatus
    err: str | None = None
    tail_lines: list[str] = Field(default_factory=list)
    started_at: datetime
    finished_at: datetime | None = None
