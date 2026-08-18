from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict

from app.models.timestamped import TimestampedModel


class Plan(str, Enum):
    FREE = "free"
    PRO = "pro"


class SubscriptionStatus(str, Enum):
    INCOMPLETE = "incomplete"
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELED = "canceled"
    UNPAID = "unpaid"
    INCOMPLETE_EXPIRED = "incomplete_expired"
    TRIALING = "trialing"


class PlanLimits(BaseModel):
    model_config = ConfigDict(frozen=True)

    max_workspaces: int
    max_hosts_per_workspace: int
    max_jobs_per_workspace: int
    max_log_lines_per_job: int
    retention_days: int


class BillingAccount(TimestampedModel):
    user_id: str
    plan: Plan = Plan.FREE
    subscription_status: SubscriptionStatus | None = None
    stripe_customer_id: str | None = None
    stripe_subscription_id: str | None = None
    current_period_end: datetime | None = None
    cancel_at_period_end: bool = False
    last_stripe_event_id: str | None = None
    last_stripe_event_created: int | None = None


FREE_PLAN_LIMITS = PlanLimits(
    max_workspaces=1,
    max_hosts_per_workspace=1,
    max_jobs_per_workspace=30,
    max_log_lines_per_job=15,
    retention_days=7,
)

PRO_PLAN_LIMITS = PlanLimits(
    max_workspaces=3,
    max_hosts_per_workspace=5,
    max_jobs_per_workspace=3000,
    max_log_lines_per_job=50,
    retention_days=30,
)


def get_plan_limits(plan: Plan) -> PlanLimits:
    if plan is Plan.PRO:
        return PRO_PLAN_LIMITS
    return FREE_PLAN_LIMITS
