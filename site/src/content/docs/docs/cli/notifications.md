---
title: Notifications
description: Configure Slack and Discord notifications.
---

## Configuration Examples

```yaml
notify:
  time_zone: "Asia/Tokyo"
  slack:
    webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}

  discord:
    webhook_url: ${OBSERN_DISCORD_WEBHOOK_URL}
```

Set each `webhook_url` to the webhook URL for the provider you want to use.
You can configure either one or both.

## Behavior

- Notifications are sent when a job reaches a terminal state.
- Slack and Discord notifications include the command, tags, start and end times, and trailing log lines.
- If `notify.time_zone` is set, timestamps are rendered in that time zone.

## Slack Examples

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 items-start">
  <div class="!m-0">
    <p class="!m-0 !mb-2 font-semibold">Success</p>
    <img src="/docs/cli/slack-success.png" alt="Slack success notification example" class="block w-full h-auto !m-0 rounded border border-slate-200" />
  </div>
  <div class="!m-0">
    <p class="!m-0 !mb-2 font-semibold">Canceled</p>
    <img src="/docs/cli/slack-canceled.png" alt="Slack canceled notification example" class="block w-full h-auto !m-0 rounded border border-slate-200" />
  </div>
  <div class="!m-0">
    <p class="!m-0 !mb-2 font-semibold">Failure</p>
    <img src="/docs/cli/slack-failed.png" alt="Slack failure notification example" class="block w-full h-auto !m-0 rounded border border-slate-200" />
  </div>
</div>
