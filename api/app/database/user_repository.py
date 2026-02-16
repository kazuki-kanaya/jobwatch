from typing import Any

from app.database.client import DynamoDBKeys, DynamoDBMappers, DynamoDBTable
from app.models.user import User


class UserRepository:
    def __init__(self, table: DynamoDBTable) -> None:
        self._table = table

    def create(self, user: User) -> User:
        item = self._to_item(user)
        self._table.put(item)
        return user

    def get(self, user_id: str) -> User | None:
        pk = DynamoDBKeys.user_pk(user_id)
        sk = DynamoDBKeys.user_sk()
        item = self._table.get(pk, sk)
        if item is None:
            return None
        return DynamoDBMappers.from_item(item, User)

    def get_many(self, user_ids: set[str]) -> list[User]:
        keys = [
            {
                "PK": DynamoDBKeys.user_pk(user_id),
                "SK": DynamoDBKeys.user_sk(),
            }
            for user_id in user_ids
        ]
        items = self._table.batch_get(keys)
        return [DynamoDBMappers.from_item(item, User) for item in items]

    def update(self, user: User) -> User:
        item = self._to_item(user)
        self._table.put(item)
        return user

    def delete(self, user: User) -> None:
        pk = DynamoDBKeys.user_pk(user.user_id)
        items = list(self._table.query_all(pk))
        if items:
            self._table.batch_delete(items)

    def create_if_not_exists(self, user: User) -> User:
        existing_user = self.get(user.user_id)
        if existing_user:
            return existing_user

        return self.create(user)

    @staticmethod
    def _to_item(user: User) -> dict[str, Any]:
        pk = DynamoDBKeys.user_pk(user.user_id)
        sk = DynamoDBKeys.user_sk()
        return DynamoDBMappers.to_item(user, pk, sk)
