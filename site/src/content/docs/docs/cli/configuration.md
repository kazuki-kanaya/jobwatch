---
title: Configuration
description: Configure Obsern in obsern.yaml.
---

`obsern init` generates `obsern.yaml` in your current directory.

## Base Template

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
  discord:
    webhook_url: ${OBSERN_DISCORD_WEBHOOK_URL}
```

## Required Minimum

Set at least one of the following:

- `api`
- `notify.slack`
- `notify.discord`

If none of them are configured, validation fails and `obsern run` stops.

## Field Reference

- `run.tags`: Tags added to jobs and notifications.
- `run.tail_lines`: Number of trailing log lines to keep. Allowed range: `0` to `200`.
- `api.host_token`: Host token issued from the dashboard.
- `api.base_url`: Absolute API URL used to publish job status.
- `notify.time_zone`: IANA time zone used when rendering notification timestamps, for example `Asia/Tokyo`.
- `notify.slack.webhook_url`: Slack Incoming Webhook URL.
- `notify.discord.webhook_url`: Discord webhook URL.

## Common Setup Patterns

API only:

```yaml
run:
  tags: ["default"]
  tail_lines: 80

api:
  host_token: ${OBSERN_HOST_TOKEN}
  base_url: https://api.obsern.dev
```

Slack only:

```yaml
run:
  tags: ["default"]
  tail_lines: 80

notify:
  time_zone: "Asia/Tokyo"
  slack:
    webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
```

Discord only:

```yaml
run:
  tags: ["default"]
  tail_lines: 80

notify:
  time_zone: "Asia/Tokyo"
  discord:
    webhook_url: ${OBSERN_DISCORD_WEBHOOK_URL}
```

API + notifications:

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
  discord:
    webhook_url: ${OBSERN_DISCORD_WEBHOOK_URL}
```

## Environment Variables

Use environment variables for secrets instead of hardcoding them in `obsern.yaml`.

```bash
export OBSERN_HOST_TOKEN="<your-host-token>"
export OBSERN_SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
export OBSERN_DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
```

## Pre-run Checklist

- `obsern.yaml` exists.
- At least one of `api`, `notify.slack`, or `notify.discord` is configured.
- `run.tail_lines` is within the range `0` to `200`.
- Environment variables are available in the same shell session.
