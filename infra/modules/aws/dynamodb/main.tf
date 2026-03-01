resource "aws_dynamodb_table" "this" {
  name         = var.table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"
  range_key    = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  attribute {
    name = "job_id"
    type = "S"
  }

  attribute {
    name = "token_hash"
    type = "S"
  }

  attribute {
    name = "membership_user_key"
    type = "S"
  }

  global_secondary_index {
    name            = "job_id-index"
    projection_type = "ALL"

    key_schema {
      attribute_name = "job_id"
      key_type       = "HASH"
    }
  }

  global_secondary_index {
    name            = "token_hash-index"
    projection_type = "ALL"

    key_schema {
      attribute_name = "token_hash"
      key_type       = "HASH"
    }
  }

  global_secondary_index {
    name            = "membership_user_key-index"
    projection_type = "ALL"

    key_schema {
      attribute_name = "membership_user_key"
      key_type       = "HASH"
    }
  }

  tags = var.tags
}
