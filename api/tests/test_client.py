from app.database.client import DynamoDBTable


class FakeClient:
    def __init__(self) -> None:
        self.transact_items: list[dict] | None = None

    def transact_write_items(self, *, TransactItems: list[dict]) -> None:
        self.transact_items = TransactItems


class FakeTable:
    name = "obsern-table"

    def __init__(self) -> None:
        self.client = FakeClient()
        self.meta = type("Meta", (), {"client": self.client})()


def test_transaction_values_are_serialized_for_the_low_level_dynamodb_client() -> None:
    table = FakeTable()

    DynamoDBTable(table).transact_write(
        [
            {
                "Put": {
                    "Item": {"PK": "USER#user-1", "count": 1},
                    "ExpressionAttributeValues": {":expected": 0},
                }
            },
            {
                "Update": {
                    "Key": {"PK": "USER#user-1", "SK": "META#QUOTA"},
                    "ExpressionAttributeValues": {":one": 1},
                }
            },
        ]
    )

    assert table.client.transact_items == [
        {
            "Put": {
                "TableName": "obsern-table",
                "Item": {
                    "PK": {"S": "USER#user-1"},
                    "count": {"N": "1"},
                },
                "ExpressionAttributeValues": {":expected": {"N": "0"}},
            }
        },
        {
            "Update": {
                "TableName": "obsern-table",
                "Key": {
                    "PK": {"S": "USER#user-1"},
                    "SK": {"S": "META#QUOTA"},
                },
                "ExpressionAttributeValues": {":one": {"N": "1"}},
            }
        },
    ]
