from typing import Any, Iterable

from app.database.client import DynamoDBKeys, DynamoDBMappers, DynamoDBTable
from app.models.workspace_membership import MembershipRole, WorkspaceMembership
from app.utils.datetime import now


class WorkspaceMembershipRepository:
    def __init__(self, table: DynamoDBTable) -> None:
        self._table = table

    def create(self, workspace_membership: WorkspaceMembership) -> WorkspaceMembership:
        item = self._to_item(workspace_membership)
        self._table.put(item)
        return workspace_membership

    def get(self, workspace_id: str, user_id: str) -> WorkspaceMembership | None:
        pk = DynamoDBKeys.workspace_pk(workspace_id)
        sk = DynamoDBKeys.workspace_membership_sk(user_id)
        item = self._table.get(pk, sk)
        if item is None:
            return None
        return self._from_item(item)

    def update(self, workspace_membership: WorkspaceMembership) -> WorkspaceMembership:
        item = self._to_item(workspace_membership)
        self._table.put(item)
        return workspace_membership

    def delete(self, workspace_id: str, user_id: str) -> None:
        pk = DynamoDBKeys.workspace_pk(workspace_id)
        sk = DynamoDBKeys.workspace_membership_sk(user_id)
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
        self, workspace_id: str, from_user_id: str, to_user_id: str
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

        self._table.transact_write(
            [
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
        )

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
