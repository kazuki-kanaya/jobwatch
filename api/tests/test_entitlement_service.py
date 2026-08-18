from typing import cast

import pytest

from app.database.billing_repository import BillingRepository
from app.database.workspace_membership_repository import WorkspaceMembershipRepository
from app.models.billing import BillingAccount, Plan
from app.models.exceptions import QuotaExceededError
from app.models.workspace_membership import MembershipRole, WorkspaceMembership
from app.services.entitlement_service import EntitlementService


class FakeBillingRepository:
    def __init__(self, account: BillingAccount | None = None) -> None:
        self.account = account

    def get(self, user_id: str) -> BillingAccount | None:
        return self.account


class FakeMembershipRepository:
    def __init__(self, memberships: list[WorkspaceMembership]) -> None:
        self.memberships = memberships

    def list_by_user(self, user_id: str) -> list[WorkspaceMembership]:
        return [
            membership
            for membership in self.memberships
            if membership.user_id == user_id
        ]


def membership(
    workspace_id: str, user_id: str, role: MembershipRole
) -> WorkspaceMembership:
    return WorkspaceMembership(workspace_id=workspace_id, user_id=user_id, role=role)


def test_missing_billing_account_resolves_to_free_entitlements() -> None:
    service = EntitlementService(
        cast(BillingRepository, FakeBillingRepository()),
        cast(WorkspaceMembershipRepository, FakeMembershipRepository([])),
    )

    entitlement = service.get_for_user("user-1")

    assert entitlement.plan is Plan.FREE
    assert entitlement.workspace_count == 0
    assert entitlement.limits.max_workspaces == 1


def test_member_workspace_does_not_consume_owned_workspace_limit() -> None:
    memberships = [membership("workspace-1", "user-1", MembershipRole.EDITOR)]
    service = EntitlementService(
        cast(BillingRepository, FakeBillingRepository()),
        cast(WorkspaceMembershipRepository, FakeMembershipRepository(memberships)),
    )

    entitlement = service.get_for_user("user-1")

    assert entitlement.workspace_count == 0


def test_free_user_cannot_create_a_second_owned_workspace() -> None:
    memberships = [membership("workspace-1", "user-1", MembershipRole.OWNER)]
    service = EntitlementService(
        cast(BillingRepository, FakeBillingRepository()),
        cast(WorkspaceMembershipRepository, FakeMembershipRepository(memberships)),
    )

    with pytest.raises(QuotaExceededError):
        service.assert_can_create_workspace("user-1")


def test_pro_user_can_create_a_third_owned_workspace() -> None:
    memberships = [
        membership("workspace-1", "user-1", MembershipRole.OWNER),
        membership("workspace-2", "user-1", MembershipRole.OWNER),
    ]
    account = BillingAccount(user_id="user-1", plan=Plan.PRO)
    service = EntitlementService(
        cast(BillingRepository, FakeBillingRepository(account)),
        cast(WorkspaceMembershipRepository, FakeMembershipRepository(memberships)),
    )

    service.assert_can_create_workspace("user-1")
