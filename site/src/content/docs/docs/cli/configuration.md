---
title: Configuration
description: Configure Obsern in obsern.yaml.
---

`obsern init` generates `obsern.yaml` in your current directory.

## Base Template

```yaml
project:
  name: my_project
  tags:
    - monitoring

api:
  enabled: true
  base_url: http://localhost:8000
  token: ${OBSERN_HOST_TOKEN}

run:
  log_tail: 80

notify:
  on_success: true
  on_failure: true
  channels:
    - kind: slack
      settings:
        webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
```

## Required Minimum

Set at least one of the following:

- `api.token`
- `notify.channels[].settings.webhook_url`

If both are empty, Obsern cannot send events.

## Field Reference

- `project.name`: Project identifier shown in notifications and dashboard.
- `project.tags`: Optional tags for grouping jobs.
- `api.enabled`: Enable/disable API publishing.
- `api.base_url`: API endpoint when API publishing is enabled.
- `api.token`: Host token issued from the dashboard.
- `run.log_tail`: Number of log lines included in final event payload.
- `notify.on_success`: Send notification on successful exit.
- `notify.on_failure`: Send notification on failed exit.
- `notify.channels`: Notification destinations.
- `notify.channels[].kind`: Channel type. Use `slack` for Slack webhook.
- `notify.channels[].settings.webhook_url`: Incoming webhook URL.

## Common Setup Patterns

API token only:

```yaml
api:
  enabled: true
  base_url: https://api.obsern.dev
  token: ${OBSERN_HOST_TOKEN}

notify:
  on_success: true
  on_failure: true
  channels: []
```

Slack webhook only:

```yaml
api:
  enabled: false

notify:
  on_success: true
  on_failure: true
  channels:
    - kind: slack
      settings:
        webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
```

Hybrid (recommended):

```yaml
api:
  enabled: true
  base_url: https://api.obsern.dev
  token: ${OBSERN_HOST_TOKEN}

notify:
  on_success: true
  on_failure: true
  channels:
    - kind: slack
      settings:
        webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
```

## Environment Variables

Prefer environment variables for secrets instead of hardcoding them in `obsern.yaml`.
If you do hardcode them, handle the file carefully, for example by excluding `obsern.yaml` from Git.

```bash
export OBSERN_HOST_TOKEN="<your-host-token>"
export OBSERN_SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
```

## Validation Checklist

Before running jobs:

- `obsern.yaml` exists.
- At least one of `api.token` or `webhook_url` is configured.
- Environment variables are available in the same shell session.
