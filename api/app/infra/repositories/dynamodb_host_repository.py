from typing import Iterable

from app.domain.host import Host
from app.infra.dynamodb.keys import DynamoDBKeys
from app.infra.dynamodb.mappers import DynamoDBMappers
from app.infra.dynamodb.table import DynamoDBTable


class DynamoDBHostRepository:
    def __init__(self, table: DynamoDBTable) -> None:
        self._table = table

    def create(self, host: Host) -> Host:
        pk = DynamoDBKeys.pk(host.workspace_id)
        sk = DynamoDBKeys.host_sk(host.id)
        item = DynamoDBMappers.to_item(host, pk, sk)
        self._table.put(item)
        return host

    def get(self, workspace_id: str, host_id: str) -> Host | None:
        pk = DynamoDBKeys.pk(workspace_id)
        sk = DynamoDBKeys.host_sk(host_id)
        item = self._table.get(pk, sk)
        if item is None:
            return None
        return DynamoDBMappers.from_item(item, Host)

    def find_by_token_hash(self, token_hash: str) -> Host | None:
        items = list(
            self._table.query_gsi("token_hash-index", "token_hash", token_hash)
        )
        if not items:
            return None
        return DynamoDBMappers.from_item(items[0], Host)

    def list_by_workspace(self, workspace_id: str) -> Iterable[Host]:
        pk = DynamoDBKeys.pk(workspace_id)
        sk_prefix = DynamoDBKeys.host_prefix()
        items = self._table.query_begins_with(pk, sk_prefix)
        for item in items:
            yield DynamoDBMappers.from_item(item, Host)

    def update(self, host: Host) -> Host:
        pk = DynamoDBKeys.pk(host.workspace_id)
        sk = DynamoDBKeys.host_sk(host.id)
        item = DynamoDBMappers.to_item(host, pk, sk)
        self._table.put(item)
        return host

    def delete(self, workspace_id: str, host_id: str) -> None:
        pk = DynamoDBKeys.pk(workspace_id)
        sk_prefix = DynamoDBKeys.job_host_prefix(host_id)
        job_items = list(self._table.query_begins_with(pk, sk_prefix))
        if job_items:
            self._table.batch_delete(job_items)
        sk = DynamoDBKeys.host_sk(host_id)
        self._table.delete(pk, sk)
