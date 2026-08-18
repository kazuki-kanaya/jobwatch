from typing import Any

from app.database.client import DynamoDBKeys, DynamoDBMappers, DynamoDBTable
from app.database.workspace_quota_repository import WorkspaceQuotaRepository
from app.models.workspace import Workspace
from app.models.workspace_membership import MembershipRole, WorkspaceMembership


class WorkspaceRepository:
    def __init__(
        self,
        table: DynamoDBTable,
        workspace_quota_repository: WorkspaceQuotaRepository | None = None,
    ) -> None:
        self._table = table
        self._workspace_quota_repository = workspace_quota_repository

    def create_with_owner(
        self,
        workspace: Workspace,
        owner_membership: WorkspaceMembership,
        expected_owner_count: int,
        max_owned_workspaces: int,
    ) -> Workspace:
        workspace_item = self._to_item(workspace)
        membership_item = self._to_membership_item(owner_membership)
        transaction_items = [
            {
                "Put": {
                    "Item": workspace_item,
                    "ConditionExpression": "attribute_not_exists(PK) AND attribute_not_exists(SK)",
                }
            },
            {
                "Put": {
                    "Item": membership_item,
                    "ConditionExpression": "attribute_not_exists(PK) AND attribute_not_exists(SK)",
                }
            },
        ]
        if self._workspace_quota_repository:
            self._workspace_quota_repository.initialize_if_missing(
                owner_membership.user_id, expected_owner_count
            )
            transaction_items.append(
                self._workspace_quota_repository.increment_item(
                    owner_membership.user_id,
                    expected_owner_count,
                    max_owned_workspaces,
                )
            )

        self._table.transact_write(transaction_items)
        return workspace

    def get(self, workspace_id: str) -> Workspace | None:
        pk = DynamoDBKeys.workspace_pk(workspace_id)
        sk = DynamoDBKeys.workspace_sk()
        item = self._table.get(pk, sk)
        if item is None:
            return None
        return DynamoDBMappers.from_item(item, Workspace)

    def get_many(self, workspace_ids: set[str]) -> list[Workspace]:
        keys = [
            {
                "PK": DynamoDBKeys.workspace_pk(workspace_id),
                "SK": DynamoDBKeys.workspace_sk(),
            }
            for workspace_id in workspace_ids
        ]
        items = self._table.batch_get(keys)
        return [DynamoDBMappers.from_item(item, Workspace) for item in items]

    def update(self, workspace: Workspace) -> Workspace:
        item = self._to_item(workspace)
        self._table.put(item)
        return workspace

    def delete(self, workspace: Workspace) -> None:
        pk = DynamoDBKeys.workspace_pk(workspace.workspace_id)
        items = list(self._table.query_all(pk))
        if not items:
            return

        owner_items = [
            item for item in items if item.get("role") == MembershipRole.OWNER.value
        ]
        transaction_items: list[dict[str, Any]] = [
            {
                "Delete": {
                    "Key": {"PK": pk, "SK": DynamoDBKeys.workspace_sk()},
                    "ConditionExpression": "attribute_exists(PK)",
                }
            }
        ]
        removed_keys = {(pk, DynamoDBKeys.workspace_sk())}
        for owner_item in owner_items:
            owner_user_id = owner_item.get("user_id")
            owner_sk = owner_item.get("SK")
            if not isinstance(owner_user_id, str) or not isinstance(owner_sk, str):
                continue
            transaction_items.append(
                {
                    "Delete": {
                        "Key": {"PK": pk, "SK": owner_sk},
                        "ConditionExpression": "attribute_exists(PK)",
                    }
                }
            )
            removed_keys.add((pk, owner_sk))
            if (
                self._workspace_quota_repository
                and self._workspace_quota_repository.get(owner_user_id) is not None
            ):
                transaction_items.append(
                    self._workspace_quota_repository.decrement_item(owner_user_id)
                )

        self._table.transact_write(transaction_items)
        remaining_items = [
            item
            for item in items
            if (item.get("PK"), item.get("SK")) not in removed_keys
        ]
        if remaining_items:
            self._table.batch_delete(remaining_items)

    @staticmethod
    def _to_item(workspace: Workspace) -> dict[str, Any]:
        pk = DynamoDBKeys.workspace_pk(workspace.workspace_id)
        sk = DynamoDBKeys.workspace_sk()
        return DynamoDBMappers.to_item(workspace, pk, sk)

    @staticmethod
    def _to_membership_item(owner_membership: WorkspaceMembership) -> dict[str, Any]:
        pk = DynamoDBKeys.workspace_pk(owner_membership.workspace_id)
        sk = DynamoDBKeys.workspace_membership_sk(owner_membership.user_id)
        item = DynamoDBMappers.to_item(owner_membership, pk, sk)
        item["membership_user_key"] = owner_membership.user_id
        return item
