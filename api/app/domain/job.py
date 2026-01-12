from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field

JobId = str


class JobStatus(str, Enum):
    RUNNING = "RUNNING"
    FINISHED = "FINISHED"
    FAILED = "FAILED"


class JobBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    project: str
    command: str
    args: list[str]
    tags: list[str] = Field(default_factory=list)


class JobCreate(JobBase):
    started_at: datetime | None = None


class JobUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    status: JobStatus | None = None
    success: bool | None = None
    err: str | None = None
    tail_lines: list[str] | None = None
    finished_at: datetime | None = None


class JobQuery(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    status: JobStatus | None = None
    project: str | None = None
    tag: str | None = None


class Job(JobBase):
    id: JobId
    status: JobStatus = JobStatus.RUNNING
    success: bool | None = None
    err: str | None = None
    tail_lines: list[str] = Field(default_factory=list)
    started_at: datetime | None = None
    finished_at: datetime | None = None
