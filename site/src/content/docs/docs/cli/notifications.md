---
title: Notifications (Slack/Webhook)
description: Configure Slack/Webhook notifications.
---

## Configuration Example

```yaml
notify:
  on_success: true
  on_failure: true
  channels:
    - kind: slack
      settings:
        webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
```

Set `webhook_url` to your incoming webhook endpoint.

## Behavior

- `on_success: true`: send notification on success.
- `on_failure: true`: send notification on failure.

## Slack Examples

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
  <div class="!m-0">
    <p class="!m-0 !mb-2 font-semibold">Success</p>
    <img src="/docs/cli/slack-success.png" alt="Slack success notification example" class="block w-full h-auto !m-0 rounded border border-slate-200" />
  </div>
  <div class="!m-0">
    <p class="!m-0 !mb-2 font-semibold">Failure</p>
    <img src="/docs/cli/slack-failed.png" alt="Slack failure notification example" class="block w-full h-auto !m-0 rounded border border-slate-200" />
  </div>
</div>
