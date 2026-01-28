from app.domain.workspace import Workspace
from app.infra.dynamodb.keys import DynamoDBKeys
from app.infra.dynamodb.mappers import DynamoDBMappers
from app.infra.dynamodb.table import DynamoDBTable


class DynamoDBWorkspaceRepository:
    def __init__(self, table: DynamoDBTable) -> None:
        self._table = table

    def create(self, workspace: Workspace) -> Workspace:
        pk = DynamoDBKeys.pk(workspace.workspace_id)
        sk = DynamoDBKeys.workspace_sk()
        item = DynamoDBMappers.to_item(workspace, pk, sk)
        self._table.put(item)
        return workspace

    def get(self, workspace_id: str) -> Workspace | None:
        pk = DynamoDBKeys.pk(workspace_id)
        sk = DynamoDBKeys.workspace_sk()
        item = self._table.get(pk, sk)
        if item is None:
            return None
        return DynamoDBMappers.from_item(item, Workspace)

    def update(self, workspace: Workspace) -> Workspace:
        pk = DynamoDBKeys.pk(workspace.workspace_id)
        sk = DynamoDBKeys.workspace_sk()
        item = DynamoDBMappers.to_item(workspace, pk, sk)
        self._table.put(item)
        return workspace

    def delete(self, workspace: Workspace) -> None:
        pk = DynamoDBKeys.pk(workspace.workspace_id)
        items = list(self._table.query_all(pk))
        if items:
            self._table.batch_delete(items)
