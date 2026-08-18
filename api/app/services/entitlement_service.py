from pydantic import BaseModel, ConfigDict

from app.database.billing_repository import BillingRepository
from app.database.workspace_membership_repository import WorkspaceMembershipRepository
from app.database.workspace_quota_repository import WorkspaceQuotaRepository
from app.models.billing import BillingAccount, Plan, PlanLimits, get_plan_limits
from app.models.exceptions import QuotaExceededError
from app.models.workspace_membership import MembershipRole


class EntitlementSnapshot(BaseModel):
    model_config = ConfigDict(frozen=True)

    user_id: str
    plan: Plan
    limits: PlanLimits
    workspace_count: int


class EntitlementService:
    def __init__(
        self,
        billing_repository: BillingRepository,
        workspace_membership_repository: WorkspaceMembershipRepository,
        workspace_quota_repository: WorkspaceQuotaRepository | None = None,
    ) -> None:
        self._billing_repository = billing_repository
        self._workspace_membership_repository = workspace_membership_repository
        self._workspace_quota_repository = workspace_quota_repository

    def get_for_user(self, user_id: str) -> EntitlementSnapshot:
        account = self._billing_repository.get(user_id) or BillingAccount(
            user_id=user_id
        )
        workspace_count = (
            self._workspace_quota_repository.get(user_id)
            if self._workspace_quota_repository
            else None
        )
        if workspace_count is None:
            workspace_count = sum(
                1
                for membership in self._workspace_membership_repository.list_by_user(
                    user_id
                )
                if membership.role is MembershipRole.OWNER
            )
            if self._workspace_quota_repository:
                self._workspace_quota_repository.initialize_if_missing(
                    user_id, workspace_count
                )
        return EntitlementSnapshot(
            user_id=user_id,
            plan=account.plan,
            limits=get_plan_limits(account.plan),
            workspace_count=workspace_count,
        )

    def assert_can_create_workspace(self, user_id: str) -> EntitlementSnapshot:
        entitlement = self.get_for_user(user_id)
        if entitlement.workspace_count >= entitlement.limits.max_workspaces:
            raise QuotaExceededError(
                f"Workspace limit reached for the {entitlement.plan.value} plan"
            )
        return entitlement
