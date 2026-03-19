---
title: Quickstart
description: 設定を初期化して最初の監視を実行します。
---

この手順で、最短で最初の通知またはダッシュボード反映まで確認できます。

## 1. 設定ファイルを生成

```bash
obsern init
```

`obsern.yaml` が生成されます。

## 2. 配信先を1つ設定

`obsern.yaml` で次のどちらかを設定します。

- `api.host_token` と `api.base_url`（ダッシュボード / API 連携）
- `notify.slack.webhook_url`（Slack 通知）

最小の Slack 設定例:

```yaml
run:
  tags: ["default"]
  tail_lines: 80

notify:
  time_zone: "Asia/Tokyo"
  slack:
    webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
```

## 3. Obsern 経由でコマンド実行

```bash
obsern run sh -c "echo start && sleep 2 && echo done"
```

## 4. 結果確認

- Slack 設定時: メッセージが届くことを確認
- API 設定時: ダッシュボードに実行結果が表示されることを確認

## 5. 失敗ケースも確認

```bash
obsern run sh -c "echo failing && exit 1"
```

Slack 設定時は通知が届き、API 設定時は失敗ステータスのジョブとして表示されます。

## 次のステップ

詳細は [Configuration](./configuration/) を参照してください。
