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
  base_url: https://api.obsern.com

notify:
  time_zone: "Asia/Tokyo"
  slack:
    webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
```

## Required Minimum

Set at least one of the following:

- `api`
- `notify.slack`

If both are missing, validation fails and `obsern run` stops.

## Field Reference

- `run.tags`: Tags added to jobs and notifications.
- `run.tail_lines`: Number of trailing log lines to keep. Allowed range: `0` to `200`.
- `api.host_token`: Host token issued from the dashboard.
- `api.base_url`: Absolute API URL used to publish job status.
- `notify.time_zone`: IANA time zone used when rendering notification timestamps, for example `Asia/Tokyo`.
- `notify.slack.webhook_url`: Slack Incoming Webhook URL.

## Common Setup Patterns

API only:

```yaml
run:
  tags: ["default"]
  tail_lines: 80

api:
  host_token: ${OBSERN_HOST_TOKEN}
  base_url: https://api.obsern.com
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

API + Slack:

```yaml
run:
  tags: ["default"]
  tail_lines: 80

api:
  host_token: ${OBSERN_HOST_TOKEN}
  base_url: https://api.obsern.com

notify:
  time_zone: "Asia/Tokyo"
  slack:
    webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
```

## Environment Variables

Use environment variables for secrets instead of hardcoding them in `obsern.yaml`.

```bash
export OBSERN_HOST_TOKEN="<your-host-token>"
export OBSERN_SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
```

## Pre-run Checklist

- `obsern.yaml` exists.
- Either `api` or `notify.slack` is configured.
- `run.tail_lines` is within the range `0` to `200`.
- Environment variables are available in the same shell session.
