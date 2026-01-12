from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.domain.job import JobStatus


class JobCreateRequest(BaseModel):
    project: str
    command: str
    args: list[str]
    tags: list[str] = Field(default_factory=list)
    started_at: datetime


class JobUpdateRequest(BaseModel):
    status: JobStatus | None = None
    success: bool | None = None
    err: str | None = None
    tail_lines: list[str] | None = None
    finished_at: datetime | None = None


class JobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    project: str
    command: str
    args: list[str]
    tags: list[str]
    status: JobStatus
    success: bool | None = None
    err: str | None = None
    tail_lines: list[str]
    started_at: datetime
    finished_at: datetime | None = None
