---
title: Quickstart
description: 設定を初期化して最初の監視を実行します。
---

この手順で、最短で最初の通知まで確認できます。

## 1. 設定ファイルを生成

```bash
obsern init
```

`obsern.yaml` が生成されます。

## 2. 通知経路を1つ設定

`obsern.yaml` で次のどちらかを設定します。

- `api.token`（Dashboard/API 連携）
- `notify.channels[].settings.webhook_url`（Slack/Webhook 連携）

最小の Slack 設定例:

```yaml
notify:
  on_success: true
  on_failure: true
  channels:
    - kind: slack
      settings:
        webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
```

## 3. Obsern 経由でコマンド実行

```bash
obsern run "echo start && sleep 2 && echo done"
```

## 4. 結果確認

- Slack 設定時: メッセージが届くことを確認
- API トークン設定時: Dashboard に実行結果が表示されることを確認

## 5. 失敗通知も確認

```bash
obsern run "echo failing && exit 1"
```

`notify.on_failure: true` なら失敗通知を受け取れます。

## 次のステップ

詳細は [Configuration](./configuration/) を参照してください。
