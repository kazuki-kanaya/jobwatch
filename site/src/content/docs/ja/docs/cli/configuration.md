---
title: Configuration
description: obsern.yaml の設定方法。
---

`obsern init` を実行すると、カレントディレクトリに `obsern.yaml` が生成されます。

## 基本テンプレート

```yaml
run:
  tags: ["default"]
  tail_lines: 80

api:
  host_token: ${OBSERN_HOST_TOKEN}
  base_url: https://api.obsern.dev

notify:
  time_zone: "Asia/Tokyo"
  slack:
    webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
```

## 最低限必要な設定

次のどちらかを必ず設定してください。

- `api`
- `notify.slack`

どちらも未設定の場合、バリデーションエラーになり `obsern run` は停止します。

## 項目リファレンス

- `run.tags`: ジョブや通知に付与するタグ
- `run.tail_lines`: 最終的に保持するログ末尾行数。指定可能範囲は `0` から `200`
- `api.host_token`: ダッシュボードで発行したホストトークン
- `api.base_url`: ジョブ状態を送信する API の絶対 URL
- `notify.time_zone`: 通知時刻の表示に使う IANA タイムゾーン。例: `Asia/Tokyo`
- `notify.slack.webhook_url`: Slack Incoming Webhook の URL

## よく使う設定パターン

API のみ:

```yaml
run:
  tags: ["default"]
  tail_lines: 80

api:
  host_token: ${OBSERN_HOST_TOKEN}
  base_url: https://api.obsern.dev
```

Slack のみ:

```yaml
run:
  tags: ["default"]
  tail_lines: 80

notify:
  time_zone: "Asia/Tokyo"
  slack:
    webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
```

API + Slack:

```yaml
run:
  tags: ["default"]
  tail_lines: 80

api:
  host_token: ${OBSERN_HOST_TOKEN}
  base_url: https://api.obsern.dev

notify:
  time_zone: "Asia/Tokyo"
  slack:
    webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
```

## 環境変数の設定

秘密情報は `obsern.yaml` に直書きせず、環境変数を使うことを推奨します。

```bash
export OBSERN_HOST_TOKEN="<your-host-token>"
export OBSERN_SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
```

## 実行前チェック

- `obsern.yaml` が存在する
- `api` か `notify.slack` のどちらかが設定されている
- `run.tail_lines` が `0` から `200` の範囲にある
- 同じシェルセッションで環境変数が有効
