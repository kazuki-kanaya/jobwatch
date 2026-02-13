from typing import Iterable

from app.database.client import DynamoDBKeys, DynamoDBMappers, DynamoDBTable
from app.models.exceptions import RepositoryException
from app.models.workspace_invitation import WorkspaceInvitation
from app.utils.datetime import now


class WorkspaceInvitationRepository:
    def __init__(self, table: DynamoDBTable) -> None:
        self._table = table

    def create(self, invitation: WorkspaceInvitation) -> WorkspaceInvitation:
        pk = DynamoDBKeys.workspace_pk(invitation.workspace_id)
        sk = DynamoDBKeys.workspace_invitation_sk(invitation.invitation_id)
        item = DynamoDBMappers.to_item(invitation, pk, sk)
        self._table.put(item)
        return invitation

    def get(self, workspace_id: str, invitation_id: str) -> WorkspaceInvitation | None:
        pk = DynamoDBKeys.workspace_pk(workspace_id)
        sk = DynamoDBKeys.workspace_invitation_sk(invitation_id)
        item = self._table.get(pk, sk)
        if item is None:
            return None
        return DynamoDBMappers.from_item(item, WorkspaceInvitation)

    def list_by_workspace(self, workspace_id: str) -> Iterable[WorkspaceInvitation]:
        pk = DynamoDBKeys.workspace_pk(workspace_id)
        for item in self._table.query_begins_with(
            pk, DynamoDBKeys.workspace_invitation_prefix()
        ):
            yield DynamoDBMappers.from_item(item, WorkspaceInvitation)

    def revoke(self, workspace_id: str, invitation_id: str) -> None:
        pk = DynamoDBKeys.workspace_pk(workspace_id)
        sk = DynamoDBKeys.workspace_invitation_sk(invitation_id)
        self._table.delete(pk, sk)

    def find_by_token_hash(self, token_hash: str) -> WorkspaceInvitation | None:
        items = self._table.query_gsi("token_hash-index", "token_hash", token_hash)
        for item in items:
            sk = item.get("SK", "")
            if isinstance(sk, str) and sk.startswith(
                DynamoDBKeys.workspace_invitation_prefix()
            ):
                return DynamoDBMappers.from_item(item, WorkspaceInvitation)
        return None

    def mark_used(self, workspace_id: str, invitation_id: str) -> WorkspaceInvitation:
        pk = DynamoDBKeys.workspace_pk(workspace_id)
        sk = DynamoDBKeys.workspace_invitation_sk(invitation_id)
        used_at = now().isoformat()
        attributes = self._table.update(
            key={"PK": pk, "SK": sk},
            update_expression="SET #used_at = :used_at, #updated_at = :updated_at",
            expression_attribute_names={
                "#used_at": "used_at",
                "#updated_at": "updated_at",
            },
            expression_attribute_values={
                ":used_at": used_at,
                ":updated_at": used_at,
            },
            condition_expression=(
                "attribute_exists(PK) AND attribute_exists(SK) AND attribute_not_exists(used_at)"
            ),
        )
        if not attributes:
            raise RepositoryException("failed to mark invitation as used")
        return DynamoDBMappers.from_item(attributes, WorkspaceInvitation)
