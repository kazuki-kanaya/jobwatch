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

    def get_many(self, user_ids: list[str]) -> list[User]:
        users: list[User] = []
        seen: set[str] = set()
        for user_id in user_ids:
            if user_id in seen:
                continue
            seen.add(user_id)
            user = self.get(user_id)
            if user is not None:
                users.append(user)
        return users

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
