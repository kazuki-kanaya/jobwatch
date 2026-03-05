# Infra

このディレクトリでは、Terraform のインフラを `envs/prod` 配下の段階的なステージとして管理します。

## 構成

- `envs/prod/aws/00-bootstrap`: Terraform backend 用ブートストラップ（S3 state bucket）
- `envs/prod/aws/10-acm-apigw`: API ドメイン用 ACM 証明書
- `envs/prod/aws/11-acm-cognito`: Cognito カスタムドメイン用 ACM 証明書
- `envs/prod/aws/20-core`: Cognito / DynamoDB / Lambda / API Gateway
- `envs/prod/aws/30-domain-apigw`: API Gateway カスタムドメインとマッピング
- `envs/prod/aws/31-domain-cognito`: Cognito カスタムドメイン
- `envs/prod/cloudflare/10-dns-validation`: ACM 検証用 DNS レコード
- `envs/prod/cloudflare/20-pages`: Cloudflare Pages プロジェクト
- `envs/prod/cloudflare/21-pages-domain-dns-records`: Pages カスタムドメインと DNS レコード（`obsern.dev`, `app.obsern.dev`）
- `envs/prod/cloudflare/30-dns-records-api-auth`: `api` / `auth` 向け DNS レコード
- `modules/`: 共通 Terraform モジュール
- `scripts/`: 補助スクリプト

## 初回セットアップ手順

1. `terraform.tfvars` を作成・編集:
   - `task init:tfvars`
2. backend を作成（初回のみ）:
   - `task init:bootstrap`
   - `task apply:bootstrap`
3. backend 設定ファイルを作成・編集:
   - `cp infra/envs/prod/backend.s3.hcl.example infra/envs/prod/backend.s3.hcl`
4. 各ステージを初期化:
   - `task init`

## 必要な認証情報・キー

### AWS

- AWS 認証情報（`~/.aws/credentials` / `~/.aws/config`）
- `aws_profile`（各 `terraform.tfvars`、デフォルトは `default`）
- `infra/envs/prod/backend.s3.hcl` の backend 設定:
  - `bucket`
  - `region`
  - `profile`
  - `use_lockfile`

### Cloudflare

- `cloudflare_account_id`（Pages 用）
- `cloudflare_zone_id`（DNS 用）
- 管理可能な独自ドメイン（必須。例: `example.dev`）
- API トークン（用途別）
  - Pages 用トークン（例: `20-pages`, `21-pages-domain-dns-records` の Pages 操作）
  - DNS 用トークン（例: `10-dns-validation`, `21-pages-domain-dns-records` の DNS 操作, `30-dns-records-api-auth`）

推奨権限:

- Pages 用トークン: `Account / Cloudflare Pages / Edit`
- DNS 用トークン: `Zone / DNS / Edit` + `Zone / Zone / Read`

トークンは `terraform.tfvars` に設定します（リポジトリへコミットしないこと）。

## 主なコマンド

- Plan: `task plan`
- Apply（依存順）: `task apply`
- Pages の成果物を配布: `task deploy:pages`
- Apply + 配布: `task deploy`
- Destroy（逆順）: `task destroy`

`task apply` の最後に `task sync-dot-env` が実行され、Terraform の outputs から web/api の env が同期されます。

## Apply 順序

1. `aws/10-acm-apigw`
2. `aws/11-acm-cognito`
3. `cloudflare/10-dns-validation`
4. `aws/20-core`
5. `aws/30-domain-apigw`
6. `cloudflare/20-pages`
7. `cloudflare/21-pages-domain-dns-records`
8. `aws/31-domain-cognito`
9. `cloudflare/30-dns-records-api-auth`

### この順序にしている理由

- `aws/10` と `aws/11` で、API/Cognito 用の ACM 証明書を先に作成します。
- `cloudflare/10` は上記証明書の DNS 検証レコードを作るため、証明書作成の直後に実行します。
- `aws/20` はアプリのコア（Cognito/Lambda/API Gateway）なので、ドメイン関連より先に必要です。
- `aws/30` は `aws/20` の API Gateway を前提に、API カスタムドメインを作成します。
- `cloudflare/20` は Pages プロジェクトを作成します。
- `cloudflare/21` は Pages カスタムドメインと親ドメインの DNS を有効化します。これを先に通すことで、後続の Cognito カスタムドメイン検証が通ります。
- `aws/31` は `auth.<domain>` の作成時に親ドメイン解決を要求するため、`cloudflare/21` の後に実行します。
- `cloudflare/30` は最後に `api/auth` の公開 DNS を設定します（`aws/30` と `aws/31` の出力を参照）。

## 補足事項

- ステージ間の依存は `terraform_remote_state` で解決します。
- 依存関係を満たさない並列実行は避けてください。
- Pages へのアップロードは `infra apply` 後に `scripts/cloudflare/deploy-pages.sh` で実行します。

## ローカル開発（Terraform外）

ローカル開発では Terraform を使わず、`docker compose` と Task で環境を起動します。  
認証基盤には Keycloak、データストアには LocalStack（DynamoDB）を利用します。

- 起動（初期化込み）: `task infra:local:up`
- 停止（ボリューム削除込み）: `task infra:local:down`

`task infra:local:up` では、次の処理を順番に実行します。

1. `docker compose down -v`
2. `docker compose up -d`
3. `infra/scripts/local/up-localstack-ddb.sh` で DynamoDB テーブルを作成
4. `web/.env.local` と `api/.env` にローカル設定を同期

### 補足

- ローカル環境ではメール送受信は行いません。
- パスワードの再設定は Keycloak 管理コンソール（`http://localhost:8080/admin/`）で行います。
- 管理者ログインは `admin` / `admin` です。
- Keycloak テーマや Realm seed を変更した場合は、`task infra:local:up` を実行して再反映してください。
