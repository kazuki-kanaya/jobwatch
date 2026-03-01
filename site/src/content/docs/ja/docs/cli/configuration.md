---
title: Configuration
description: obsern.yaml の設定方法。
---

`obsern init` を実行すると、カレントディレクトリに `obsern.yaml` が生成されます。

## 基本テンプレート

```yaml
project:
  name: my_project
  tags:
    - monitoring

api:
  enabled: true
  base_url: https://api.obsern.dev
  token: ${OBSERN_HOST_TOKEN}

run:
  log_tail: 80

notify:
  on_success: true
  on_failure: true
  channels:
    - kind: slack
      settings:
        webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
```

## 最低限必要な設定

次のどちらかを必ず設定してください。

- `api.token`
- `notify.channels[].settings.webhook_url`

両方未設定の場合、Obsern はイベントを送信できません。

## 項目リファレンス

- `project.name`: 通知やダッシュボードで識別するプロジェクト名
- `project.tags`: ジョブ分類用の任意タグ
- `api.enabled`: API 送信を有効/無効化
- `api.base_url`: API 送信時のエンドポイント
- `api.token`: Dashboard で発行したホストトークン
- `run.log_tail`: 最終イベントに含めるログ末尾行数
- `notify.on_success`: 成功時通知の有無
- `notify.on_failure`: 失敗時通知の有無
- `notify.channels`: 通知先一覧
- `notify.channels[].kind`: チャンネル種別（Slack は `slack`）
- `notify.channels[].settings.webhook_url`: Incoming Webhook URL

## よく使う設定パターン

API トークンのみ:

```yaml
api:
  enabled: true
  base_url: https://api.obsern.dev
  token: ${OBSERN_HOST_TOKEN}

notify:
  on_success: true
  on_failure: true
  channels: []
```

Slack Webhook のみ:

```yaml
api:
  enabled: false

notify:
  on_success: true
  on_failure: true
  channels:
    - kind: slack
      settings:
        webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
```

併用（推奨）:

```yaml
api:
  enabled: true
  base_url: https://api.obsern.dev
  token: ${OBSERN_HOST_TOKEN}

notify:
  on_success: true
  on_failure: true
  channels:
    - kind: slack
      settings:
        webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
```

## 環境変数の設定

秘密情報は `obsern.yaml` に直書きせず、環境変数を使うことを推奨します。
直書きする場合は、`obsern.yaml` を Git などの管理対象から外すなど、取り扱いに注意してください。

```bash
export OBSERN_HOST_TOKEN="<your-host-token>"
export OBSERN_SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
```

## 実行前チェック

- `obsern.yaml` が存在する
- `api.token` か `webhook_url` のどちらかが設定済み
- 同じシェルセッションで環境変数が有効
