---
title: Quickstart
description: Initialize config and run your first monitoring flow.
---

This guide gets you from zero to first notification in a few minutes.

## 1. Initialize Config

```bash
obsern init
```

This creates `obsern.yaml`.

## 2. Configure One Delivery Path

Edit `obsern.yaml` and set at least one:

- `api.token` for dashboard/API delivery
- `notify.channels[].settings.webhook_url` for Slack/Webhook delivery

Minimal Slack example:

```yaml
notify:
  on_success: true
  on_failure: true
  channels:
    - kind: slack
      settings:
        webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
```

## 3. Run a Command Through Obsern

```bash
obsern run "echo start && sleep 2 && echo done"
```

## 4. Confirm Result

- If Slack webhook is configured, confirm a message is posted.
- If API token is configured, confirm the run appears in your dashboard.

## 5. Try a Failure Case

```bash
obsern run "echo failing && exit 1"
```

If `notify.on_failure` is `true`, you should receive a failure notification.

## Next Step

Go to [Configuration](./configuration/) for full field details.
