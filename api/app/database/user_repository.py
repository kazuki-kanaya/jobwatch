from app.database.client import DynamoDBKeys, DynamoDBMappers, DynamoDBTable
from app.models.user import User


class UserRepository:
    def __init__(self, table: DynamoDBTable) -> None:
        self._table = table

    def create(self, user: User) -> User:
        pk = DynamoDBKeys.user_pk(user.user_id)
        sk = DynamoDBKeys.user_sk()
        item = DynamoDBMappers.to_item(user, pk, sk)
        self._table.put(item)
        return user

    def get(self, user_id: str) -> User | None:
        pk = DynamoDBKeys.user_pk(user_id)
        sk = DynamoDBKeys.user_sk()
        item = self._table.get(pk, sk)
        if item is None:
            return None
        return DynamoDBMappers.from_item(item, User)

    def update(self, user: User) -> User:
        pk = DynamoDBKeys.user_pk(user.user_id)
        sk = DynamoDBKeys.user_sk()
        item = DynamoDBMappers.to_item(user, pk, sk)
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
