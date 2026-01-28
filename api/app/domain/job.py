from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class JobStatus(str, Enum):
    RUNNING = "RUNNING"
    FINISHED = "FINISHED"
    FAILED = "FAILED"
    CANCELED = "CANCELED"


class Job(BaseModel):
    job_id: str
    workspace_id: str
    host_id: str

    status: JobStatus

    project: str
    command: str
    args: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)

    err: str | None = None
    tail_lines: list[str] = Field(default_factory=list)

    created_at: datetime
    started_at: datetime
    finished_at: datetime | None = None
