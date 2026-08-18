from datetime import datetime

from pydantic import BaseModel

from app.models.billing import Plan, SubscriptionStatus


class BillingLimitsResponse(BaseModel):
    max_workspaces: int
    max_hosts_per_workspace: int
    max_jobs_per_workspace: int
    max_log_lines_per_job: int
    retention_days: int


class BillingResponse(BaseModel):
    plan: Plan
    subscription_status: SubscriptionStatus | None = None
    current_period_end: datetime | None = None
    cancel_at_period_end: bool
    workspace_count: int
    limits: BillingLimitsResponse
    checkout_available: bool
    portal_available: bool


class BillingSessionResponse(BaseModel):
    url: str


class BillingWebhookResponse(BaseModel):
    received: bool
