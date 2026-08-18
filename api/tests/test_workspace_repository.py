from typing import Any, cast

from app.database.client import DynamoDBTable
from app.database.workspace_quota_repository import WorkspaceQuotaRepository
from app.database.workspace_repository import WorkspaceRepository
from app.models.workspace import Workspace
from app.models.workspace_membership import MembershipRole, WorkspaceMembership


class FakeQuotaRepository:
    def __init__(self) -> None:
        self.initialized: list[tuple[str, int]] = []
        self.counts = {"user-1": 1}

    def initialize_if_missing(self, user_id: str, count: int) -> None:
        self.initialized.append((user_id, count))

    def increment_item(
        self, user_id: str, expected_count: int, max_count: int
    ) -> dict[str, Any]:
        return {
            "Update": {
                "Key": {"PK": f"USER#{user_id}"},
                "ExpressionAttributeValues": {
                    ":expected": expected_count,
                    ":max": max_count,
                },
            }
        }

    def get(self, user_id: str) -> int | None:
        return self.counts.get(user_id)

    def decrement_item(self, user_id: str) -> dict[str, Any]:
        return {"Update": {"Key": {"PK": f"USER#{user_id}"}}}


class FakeTable:
    def __init__(self) -> None:
        self.transactions: list[list[dict]] = []
        self.deleted_batches: list[list[dict]] = []

    def transact_write(self, items: list[dict]) -> None:
        self.transactions.append(items)

    def query_all(self, pk: str) -> list[dict]:
        return [
            {"PK": pk, "SK": "META#WORKSPACE"},
            {
                "PK": pk,
                "SK": "META#MEMBERSHIP#user-1",
                "user_id": "user-1",
                "role": "owner",
            },
            {"PK": pk, "SK": "META#HOST#host-1"},
        ]

    def batch_delete(self, items: list[dict]) -> None:
        self.deleted_batches.append(items)


def test_workspace_creation_includes_the_quota_update_in_the_transaction() -> None:
    table = FakeTable()
    quota = FakeQuotaRepository()
    workspace = Workspace(workspace_id="workspace-1", name="Research")
    membership = WorkspaceMembership(
        workspace_id=workspace.workspace_id,
        user_id="user-1",
        role=MembershipRole.OWNER,
    )

    WorkspaceRepository(
        cast(DynamoDBTable, table),
        cast(WorkspaceQuotaRepository, quota),
    ).create_with_owner(
        workspace,
        membership,
        expected_owner_count=0,
        max_owned_workspaces=1,
    )

    assert quota.initialized == [("user-1", 0)]
    assert len(table.transactions) == 1
    assert [next(iter(item)) for item in table.transactions[0]] == [
        "Put",
        "Put",
        "Update",
    ]


def test_workspace_deletion_decrements_the_owner_quota_atomically() -> None:
    table = FakeTable()
    quota = FakeQuotaRepository()
    workspace = Workspace(workspace_id="workspace-1", name="Research")

    WorkspaceRepository(
        cast(DynamoDBTable, table),
        cast(WorkspaceQuotaRepository, quota),
    ).delete(workspace)

    assert [next(iter(item)) for item in table.transactions[0]] == [
        "Delete",
        "Delete",
        "Update",
    ]
    assert table.deleted_batches == [
        [{"PK": "WORKSPACE#workspace-1", "SK": "META#HOST#host-1"}]
    ]
