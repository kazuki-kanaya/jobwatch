---
title: Quickstart
description: Initialize config and run your first monitoring flow.
---

This guide gets you from zero to your first dashboard update or Slack notification in just a few steps.

## 1. Initialize Config

```bash
obsern init
```

This creates `obsern.yaml`.

## 2. Configure One Delivery Path

Edit `obsern.yaml` and set at least one:

- `api.host_token` and `api.base_url` for dashboard/API delivery
- `notify.slack.webhook_url` for Slack delivery

Minimal Slack example:

```yaml
run:
  tags: ["default"]
  tail_lines: 80

notify:
  time_zone: "Asia/Tokyo"
  slack:
    webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
```

## 3. Run a Command Through Obsern

```bash
obsern run sh -c "echo start && sleep 2 && echo done"
```

## 4. Confirm Result

- If Slack is configured, confirm that a message is posted.
- If the API is configured, confirm that the run appears in the dashboard.

## 5. Try a Failure Case

```bash
obsern run sh -c "echo failing && exit 1"
```

If Slack is configured, you should receive a failure notification. If the API is configured, the job should appear with a failed status in the dashboard.

## Next Step

Go to [Configuration](./configuration/) for full field details.
