from app.database.client import DynamoDBKeys, DynamoDBMappers, DynamoDBTable
from app.models.workspace import Workspace
from app.models.workspace_membership import WorkspaceMembership


class WorkspaceRepository:
    def __init__(self, table: DynamoDBTable) -> None:
        self._table = table

    def create_with_owner(
        self,
        workspace: Workspace,
        owner_membership: WorkspaceMembership,
    ) -> Workspace:
        workspace_pk = DynamoDBKeys.workspace_pk(workspace.workspace_id)
        workspace_sk = DynamoDBKeys.workspace_sk()
        workspace_item = DynamoDBMappers.to_item(workspace, workspace_pk, workspace_sk)

        membership_pk = DynamoDBKeys.workspace_pk(owner_membership.workspace_id)
        membership_sk = DynamoDBKeys.workspace_membership_sk(owner_membership.user_id)
        membership_item = DynamoDBMappers.to_item(
            owner_membership, membership_pk, membership_sk
        )

        self._table.transact_write(
            [
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
        )
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
        pk = DynamoDBKeys.workspace_pk(workspace.workspace_id)
        sk = DynamoDBKeys.workspace_sk()
        item = DynamoDBMappers.to_item(workspace, pk, sk)
        self._table.put(item)
        return workspace

    def delete(self, workspace: Workspace) -> None:
        pk = DynamoDBKeys.workspace_pk(workspace.workspace_id)
        items = list(self._table.query_all(pk))
        if items:
            self._table.batch_delete(items)
