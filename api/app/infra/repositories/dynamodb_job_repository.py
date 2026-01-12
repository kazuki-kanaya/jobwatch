from typing import Any
from uuid import uuid4

from boto3.dynamodb.conditions import Attr

from app.domain.job import Job, JobCreate, JobId, JobQuery, JobStatus, JobUpdate
from app.ports.job_repository import JobRepository


class DynamoDBJobRepository(JobRepository):
    def __init__(self, *, table_name: str, dynamodb_resource: Any) -> None:
        self._table = dynamodb_resource.Table(table_name)

    def create(self, payload: JobCreate) -> Job:
        job_id = str(uuid4())
        job = Job(
            id=job_id,
            project=payload.project,
            command=payload.command,
            args=payload.args,
            tags=payload.tags,
            status=JobStatus.RUNNING,
            success=None,
            err=None,
            tail_lines=[],
            started_at=payload.started_at,
            finished_at=None,
        )
        item = job.model_dump(mode="json", exclude_none=True)
        self._table.put_item(
            Item=item,
            ConditionExpression=Attr("id").not_exists(),
        )
        return job

    def get(self, job_id: JobId) -> Job | None:
        response = self._table.get_item(Key={"id": job_id})
        item = response.get("Item")
        if item is None:
            return None
        return _item_to_job(item)

    def list(self, query: JobQuery) -> list[Job]:
        filter_expr = None
        if query.status is not None:
            filter_expr = Attr("status").eq(query.status)
        if query.project is not None:
            expr = Attr("project").eq(query.project)
            filter_expr = expr if filter_expr is None else filter_expr & expr
        if query.tag is not None:
            expr = Attr("tags").contains(query.tag)
            filter_expr = expr if filter_expr is None else filter_expr & expr
        scan_kwargs: dict[str, object] = {}
        if filter_expr is not None:
            scan_kwargs["FilterExpression"] = filter_expr
        items: list[dict[str, Any]] = []
        response = self._table.scan(**scan_kwargs)
        items.extend(response.get("Items", []))
        while "LastEvaluatedKey" in response:
            response = self._table.scan(
                ExclusiveStartKey=response["LastEvaluatedKey"],
                **scan_kwargs,
            )
            items.extend(response.get("Items", []))
        return [_item_to_job(item) for item in items]

    def update(self, job_id: JobId, payload: JobUpdate) -> Job | None:
        existing = self.get(job_id)
        if existing is None:
            return None
        updates = payload.model_dump(mode="json", exclude_none=True)
        if not updates:
            return existing

        names: dict[str, str] = {}
        values: dict[str, object] = {}
        set_exprs: list[str] = []
        for key, value in updates.items():
            name_key = f"#{key}"
            value_key = f":{key}"
            names[name_key] = key
            values[value_key] = value
            set_exprs.append(f"{name_key} = {value_key}")

        response = self._table.update_item(
            Key={"id": job_id},
            UpdateExpression="SET " + ", ".join(set_exprs),
            ExpressionAttributeNames=names,
            ExpressionAttributeValues=values,
            ReturnValues="ALL_NEW",
        )
        item = response.get("Attributes")
        if item is None:
            return None
        return _item_to_job(item)

    def delete(self, job_id: JobId) -> None:
        self._table.delete_item(Key={"id": job_id})


def _item_to_job(item: dict[str, Any]) -> Job:
    return Job(
        id=str(item["id"]),
        project=str(item["project"]),
        command=str(item["command"]),
        args=list(item.get("args", [])),
        tags=list(item.get("tags", [])),
        status=JobStatus(item.get("status", JobStatus.RUNNING)),
        success=item.get("success"),
        err=item.get("err"),
        tail_lines=list(item.get("tail_lines", [])),
        started_at=item.get("started_at"),
        finished_at=item.get("finished_at"),
    )
