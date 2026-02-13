from typing import Iterable

from app.database.client import DynamoDBKeys, DynamoDBMappers, DynamoDBTable
from app.models.workspace_membership import MembershipRole, WorkspaceMembership
from app.utils.datetime import now


class WorkspaceMembershipRepository:
    def __init__(self, table: DynamoDBTable) -> None:
        self._table = table

    def create(self, workspace_membership: WorkspaceMembership) -> WorkspaceMembership:
        pk = DynamoDBKeys.workspace_pk(workspace_membership.workspace_id)
        sk = DynamoDBKeys.workspace_membership_sk(workspace_membership.user_id)
        item = DynamoDBMappers.to_item(workspace_membership, pk, sk)
        self._table.put(item)
        return workspace_membership

    def get(self, workspace_id: str, user_id: str) -> WorkspaceMembership | None:
        pk = DynamoDBKeys.workspace_pk(workspace_id)
        sk = DynamoDBKeys.workspace_membership_sk(user_id)
        item = self._table.get(pk, sk)
        if item is None:
            return None
        return DynamoDBMappers.from_item(item, WorkspaceMembership)

    def update(self, workspace_membership: WorkspaceMembership) -> WorkspaceMembership:
        pk = DynamoDBKeys.workspace_pk(workspace_membership.workspace_id)
        sk = DynamoDBKeys.workspace_membership_sk(workspace_membership.user_id)
        item = DynamoDBMappers.to_item(workspace_membership, pk, sk)
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
            yield DynamoDBMappers.from_item(item, WorkspaceMembership)

    def list_by_user(self, user_id: str) -> Iterable[WorkspaceMembership]:
        items = self._table.query_gsi("gsi_user_memberships-index", "user_id", user_id)
        for item in items:
            yield DynamoDBMappers.from_item(item, WorkspaceMembership)

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
