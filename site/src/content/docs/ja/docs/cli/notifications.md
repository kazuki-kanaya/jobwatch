---
title: Notifications
description: 通知の設定。
---

## 設定例（Slack）

```yaml
notify:
  time_zone: "Asia/Tokyo"
  slack:
    webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
```

`webhook_url` には Incoming Webhook の URL を設定してください。

## 挙動

- ジョブが終了状態になったときに通知が送信されます
- Slack 通知にはコマンド、タグ、開始/終了時刻、ログ末尾が含まれます
- `notify.time_zone` を設定すると、そのタイムゾーンで時刻を表示します

## Slack 通知例

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 items-start">
  <div class="!m-0">
    <p class="!m-0 !mb-2 font-semibold">成功</p>
    <img src="/docs/cli/slack-success.png" alt="Slack 成功通知の例" class="block w-full h-auto !m-0 rounded border border-slate-200" />
  </div>
  <div class="!m-0">
    <p class="!m-0 !mb-2 font-semibold">キャンセル</p>
    <img src="/docs/cli/slack-canceled.png" alt="Slack キャンセル通知の例" class="block w-full h-auto !m-0 rounded border border-slate-200" />
  </div>
  <div class="!m-0">
    <p class="!m-0 !mb-2 font-semibold">失敗</p>
    <img src="/docs/cli/slack-failed.png" alt="Slack 失敗通知の例" class="block w-full h-auto !m-0 rounded border border-slate-200" />
  </div>
</div>
