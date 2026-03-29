---
title: Troubleshooting
description: よくある問題と対処方法。
---

## 通知が送信されない

次の順に確認してください。

1. `obsern.yaml` に次のいずれかがある
   - `api.host_token`
   - `notify.slack.webhook_url`
   - `notify.discord.webhook_url`
2. 環境変数が正しく展開されている
3. 実行コマンドが終了している（イベントは終了時に送信）

## Slack / Discord の Webhook に届かない

- `webhook_url` の形式を確認
- Webhook が有効な状態か確認
- 実行環境の外向き通信が許可されているか確認
- 失敗コマンドで再現して通知が届くか確認

## ダッシュボードに実行が出ない

- `api.host_token` が設定されているか確認
- `api.base_url` が正しい環境を指しているか確認
- `api.host_token` が対象ワークスペース/ホストのものか確認

## `obsern` コマンドが見つからない

- CLI を再インストール
- バイナリが `PATH` に入っているか確認
- 次で検証

```bash
obsern --version
```

## 環境変数が反映されない

実行前に同じシェルで値を確認:

```bash
echo "$OBSERN_HOST_TOKEN"
echo "$OBSERN_SLACK_WEBHOOK_URL"
echo "$OBSERN_DISCORD_WEBHOOK_URL"
```

空なら再 export してから再実行してください。
