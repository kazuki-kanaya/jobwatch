from typing import Any, Iterable

from app.database.client import DynamoDBKeys, DynamoDBMappers, DynamoDBTable
from app.database.workspace_quota_repository import WorkspaceQuotaRepository
from app.models.workspace_membership import MembershipRole, WorkspaceMembership
from app.utils.datetime import now


class WorkspaceMembershipRepository:
    def __init__(
        self,
        table: DynamoDBTable,
        workspace_quota_repository: WorkspaceQuotaRepository | None = None,
    ) -> None:
        self._table = table
        self._workspace_quota_repository = workspace_quota_repository

    def create(
        self,
        workspace_membership: WorkspaceMembership,
        expected_owner_count: int | None = None,
        max_owned_workspaces: int | None = None,
    ) -> WorkspaceMembership:
        item = self._to_item(workspace_membership)
        if (
            workspace_membership.role is MembershipRole.OWNER
            and self._workspace_quota_repository
            and expected_owner_count is not None
            and max_owned_workspaces is not None
        ):
            self._workspace_quota_repository.initialize_if_missing(
                workspace_membership.user_id, expected_owner_count
            )
            self._table.transact_write(
                [
                    {
                        "Put": {
                            "Item": item,
                            "ConditionExpression": "attribute_not_exists(PK)",
                        }
                    },
                    self._workspace_quota_repository.increment_item(
                        workspace_membership.user_id,
                        expected_owner_count,
                        max_owned_workspaces,
                    ),
                ]
            )
            return workspace_membership
        self._table.put(item)
        return workspace_membership

    def get(self, workspace_id: str, user_id: str) -> WorkspaceMembership | None:
        pk = DynamoDBKeys.workspace_pk(workspace_id)
        sk = DynamoDBKeys.workspace_membership_sk(user_id)
        item = self._table.get(pk, sk)
        if item is None:
            return None
        return self._from_item(item)

    def update(
        self,
        workspace_membership: WorkspaceMembership,
        previous_role: MembershipRole | None = None,
        expected_owner_count: int | None = None,
        max_owned_workspaces: int | None = None,
    ) -> WorkspaceMembership:
        item = self._to_item(workspace_membership)
        if (
            self._workspace_quota_repository
            and previous_role is not None
            and previous_role is not workspace_membership.role
        ):
            user_id = workspace_membership.user_id
            if workspace_membership.role is MembershipRole.OWNER:
                if expected_owner_count is None or max_owned_workspaces is None:
                    raise ValueError("owner promotion requires quota details")
                self._workspace_quota_repository.initialize_if_missing(
                    user_id, expected_owner_count
                )
                quota_item = self._workspace_quota_repository.increment_item(
                    user_id, expected_owner_count, max_owned_workspaces
                )
            else:
                if expected_owner_count is not None:
                    self._workspace_quota_repository.initialize_if_missing(
                        user_id, expected_owner_count
                    )
                quota_item = self._workspace_quota_repository.decrement_item(user_id)
            self._table.transact_write(
                [
                    {
                        "Put": {
                            "Item": item,
                            "ConditionExpression": "attribute_exists(PK)",
                        }
                    },
                    quota_item,
                ]
            )
            return workspace_membership
        self._table.put(item)
        return workspace_membership

    def delete(
        self,
        workspace_id: str,
        user_id: str,
        membership: WorkspaceMembership | None = None,
    ) -> None:
        pk = DynamoDBKeys.workspace_pk(workspace_id)
        sk = DynamoDBKeys.workspace_membership_sk(user_id)
        if (
            membership
            and membership.role is MembershipRole.OWNER
            and self._workspace_quota_repository
            and self._workspace_quota_repository.get(user_id) is not None
        ):
            self._table.transact_write(
                [
                    {
                        "Delete": {
                            "Key": {"PK": pk, "SK": sk},
                            "ConditionExpression": "attribute_exists(PK)",
                        }
                    },
                    self._workspace_quota_repository.decrement_item(user_id),
                ]
            )
            return
        self._table.delete(pk, sk)

    def list_by_workspace(self, workspace_id: str) -> Iterable[WorkspaceMembership]:
        pk = DynamoDBKeys.workspace_pk(workspace_id)
        sk_prefix = DynamoDBKeys.workspace_membership_prefix()
        items = self._table.query_begins_with(pk, sk_prefix)
        for item in items:
            yield self._from_item(item)

    def list_by_user(self, user_id: str) -> Iterable[WorkspaceMembership]:
        items = self._table.query_gsi(
            "membership_user_key-index", "membership_user_key", user_id
        )
        for item in items:
            yield self._from_item(item)

    def transfer_owner(
        self,
        workspace_id: str,
        from_user_id: str,
        to_user_id: str,
        new_owner_role: MembershipRole,
        from_owner_count: int,
        to_owner_count: int,
        max_owned_workspaces: int,
    ) -> None:
        from_key = {
            "PK": DynamoDBKeys.workspace_pk(workspace_id),
            "SK": DynamoDBKeys.workspace_membership_sk(from_user_id),
        }
        to_key = {
            "PK": DynamoDBKeys.workspace_pk(workspace_id),
            "SK": DynamoDBKeys.workspace_membership_sk(to_user_id),
        }
        updated_at = now().isoformat()

        transaction_items: list[dict[str, Any]] = [
            {
                "Update": {
                    "Key": to_key,
                    "UpdateExpression": "SET #role = :new_owner, #updated_at = :updated_at",
                    "ConditionExpression": "attribute_exists(PK) AND attribute_exists(SK)",
                    "ExpressionAttributeNames": {
                        "#role": "role",
                        "#updated_at": "updated_at",
                    },
                    "ExpressionAttributeValues": {
                        ":new_owner": MembershipRole.OWNER.value,
                        ":updated_at": updated_at,
                    },
                }
            },
            {
                "Update": {
                    "Key": from_key,
                    "UpdateExpression": "SET #role = :new_editor, #updated_at = :updated_at",
                    "ConditionExpression": "attribute_exists(PK) AND attribute_exists(SK) AND #role = :current_owner",
                    "ExpressionAttributeNames": {
                        "#role": "role",
                        "#updated_at": "updated_at",
                    },
                    "ExpressionAttributeValues": {
                        ":new_editor": MembershipRole.EDITOR.value,
                        ":current_owner": MembershipRole.OWNER.value,
                        ":updated_at": updated_at,
                    },
                }
            },
        ]
        if self._workspace_quota_repository:
            self._workspace_quota_repository.initialize_if_missing(
                from_user_id, from_owner_count
            )
            self._workspace_quota_repository.initialize_if_missing(
                to_user_id, to_owner_count
            )
            transaction_items.append(
                self._workspace_quota_repository.decrement_item(from_user_id)
            )
            if new_owner_role is not MembershipRole.OWNER:
                transaction_items.append(
                    self._workspace_quota_repository.increment_item(
                        to_user_id, to_owner_count, max_owned_workspaces
                    )
                )
        self._table.transact_write(transaction_items)

    @staticmethod
    def _to_item(workspace_membership: WorkspaceMembership) -> dict[str, Any]:
        pk = DynamoDBKeys.workspace_pk(workspace_membership.workspace_id)
        sk = DynamoDBKeys.workspace_membership_sk(workspace_membership.user_id)
        item = DynamoDBMappers.to_item(workspace_membership, pk, sk)
        item["membership_user_key"] = workspace_membership.user_id
        return item

    @staticmethod
    def _from_item(item: dict[str, Any]) -> WorkspaceMembership:
        item = dict(item)
        item.pop("membership_user_key", None)
        return DynamoDBMappers.from_item(item, WorkspaceMembership)
