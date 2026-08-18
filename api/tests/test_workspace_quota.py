from typing import cast

import pytest

from app.database.workspace_membership_repository import WorkspaceMembershipRepository
from app.database.workspace_repository import WorkspaceRepository
from app.models.exceptions import ConditionalCheckFailedError
from app.models.exceptions import QuotaExceededError
from app.models.billing import Plan, get_plan_limits
from app.models.user import User
from app.models.workspace import Workspace
from app.models.workspace_membership import WorkspaceMembership
from app.schemas.workspace import WorkspaceCreateRequest
from app.services.entitlement_service import EntitlementService, EntitlementSnapshot
from app.services.workspace_service import WorkspaceService


class FakeWorkspaceRepository:
    def __init__(self) -> None:
        self.created: list[tuple[Workspace, WorkspaceMembership]] = []
        self.create_args: tuple[int, int] | None = None
        self.fail_transaction = False

    def create_with_owner(
        self,
        workspace: Workspace,
        owner_membership: WorkspaceMembership,
        expected_owner_count: int,
        max_owned_workspaces: int,
    ) -> Workspace:
        self.create_args = (expected_owner_count, max_owned_workspaces)
        if self.fail_transaction:
            raise ConditionalCheckFailedError("quota changed")
        self.created.append((workspace, owner_membership))
        return workspace


class FakeMembershipRepository:
    pass


class FakeEntitlementService:
    def __init__(self, error: Exception | None = None) -> None:
        self.error = error
        self.user_ids: list[str] = []

    def assert_can_create_workspace(self, user_id: str) -> EntitlementSnapshot:
        self.user_ids.append(user_id)
        if self.error:
            raise self.error
        return EntitlementSnapshot(
            user_id=user_id,
            plan=Plan.FREE,
            limits=get_plan_limits(Plan.FREE),
            workspace_count=0,
        )


def test_workspace_creation_checks_entitlement_before_persisting() -> None:
    workspace_repository = FakeWorkspaceRepository()
    entitlement_service = FakeEntitlementService(
        QuotaExceededError("Workspace limit reached for the free plan")
    )
    service = WorkspaceService(
        cast(WorkspaceRepository, workspace_repository),
        cast(WorkspaceMembershipRepository, FakeMembershipRepository()),
        cast(EntitlementService, entitlement_service),
    )

    try:
        service.create_workspace(
            WorkspaceCreateRequest(name="Research"),
            User(user_id="user-1", name="Researcher"),
        )
    except QuotaExceededError:
        pass
    else:
        raise AssertionError("workspace creation should be rejected")

    assert entitlement_service.user_ids == ["user-1"]
    assert workspace_repository.created == []


def test_workspace_creation_persists_after_entitlement_check() -> None:
    workspace_repository = FakeWorkspaceRepository()
    entitlement_service = FakeEntitlementService()
    service = WorkspaceService(
        cast(WorkspaceRepository, workspace_repository),
        cast(WorkspaceMembershipRepository, FakeMembershipRepository()),
        cast(EntitlementService, entitlement_service),
    )

    response = service.create_workspace(
        WorkspaceCreateRequest(name="Research"),
        User(user_id="user-1", name="Researcher"),
    )

    assert entitlement_service.user_ids == ["user-1"]
    assert len(workspace_repository.created) == 1
    assert workspace_repository.create_args == (0, 1)
    assert response.name == "Research"


def test_workspace_creation_maps_a_concurrent_quota_failure() -> None:
    workspace_repository = FakeWorkspaceRepository()
    workspace_repository.fail_transaction = True
    service = WorkspaceService(
        cast(WorkspaceRepository, workspace_repository),
        cast(WorkspaceMembershipRepository, FakeMembershipRepository()),
        cast(EntitlementService, FakeEntitlementService()),
    )

    with pytest.raises(QuotaExceededError, match="Workspace limit"):
        service.create_workspace(
            WorkspaceCreateRequest(name="Research"),
            User(user_id="user-1", name="Researcher"),
        )
