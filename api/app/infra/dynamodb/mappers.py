from typing import Any, Type, TypeVar

from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)


class DynamoDBMappers:
    @staticmethod
    def to_item(entity: BaseModel, pk: str, sk: str) -> dict[str, Any]:
        dictionary = entity.model_dump(mode="json")
        dictionary.update({"PK": pk, "SK": sk})
        return dictionary

    @staticmethod
    def from_item(item: dict[str, Any], entity_type: Type[T]) -> T:
        item = dict(item)
        item.pop("PK", None)
        item.pop("SK", None)
        return entity_type.model_validate(item)
