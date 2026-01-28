from typing import Iterable

from app.domain.job import Job
from app.infra.dynamodb.keys import DynamoDBKeys
from app.infra.dynamodb.mappers import DynamoDBMappers
from app.infra.dynamodb.table import DynamoDBTable


class DynamoDBJobRepository:
    def __init__(self, table: DynamoDBTable) -> None:
        self._table = table

    def create(self, job: Job) -> Job:
        pk = DynamoDBKeys.pk(job.workspace_id)
        sk = DynamoDBKeys.job_sk(job.host_id, job.job_id)
        item = DynamoDBMappers.to_item(job, pk, sk)
        self._table.put(item)
        return job

    def get(self, job_id: str) -> Job | None:
        items = list(self._table.query_gsi("job_id-index", "job_id", job_id))
        if not items:
            return None
        return DynamoDBMappers.from_item(items[0], Job)

    def list_by_workspace(self, workspace_id: str) -> Iterable[Job]:
        pk = DynamoDBKeys.pk(workspace_id)
        sk_prefix = DynamoDBKeys.job_prefix()
        items = self._table.query_begins_with(pk, sk_prefix)
        for item in items:
            yield DynamoDBMappers.from_item(item, Job)

    def list_by_host(self, workspace_id: str, host_id: str) -> Iterable[Job]:
        pk = DynamoDBKeys.pk(workspace_id)
        sk_prefix = DynamoDBKeys.job_host_prefix(host_id)
        items = self._table.query_begins_with(pk, sk_prefix)
        for item in items:
            yield DynamoDBMappers.from_item(item, Job)

    def update(self, job: Job) -> Job:
        pk = DynamoDBKeys.pk(job.workspace_id)
        sk = DynamoDBKeys.job_sk(job.host_id, job.job_id)
        item = DynamoDBMappers.to_item(job, pk, sk)
        self._table.put(item)
        return job

    def delete(self, job: Job) -> None:
        pk = DynamoDBKeys.pk(job.workspace_id)
        sk = DynamoDBKeys.job_sk(job.host_id, job.job_id)
        self._table.delete(pk, sk)
