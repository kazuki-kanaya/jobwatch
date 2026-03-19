---
title: Troubleshooting
description: Common issues and fixes.
---

## Notifications Are Not Sent

Check in this order:

1. `obsern.yaml` has at least one of:
   - `api.host_token`
   - `notify.slack.webhook_url`
2. Environment variables are expanded correctly.
3. The command has actually finished. Events are sent when the command ends.

## Slack/Webhook Does Not Receive Messages

- Verify `webhook_url` format.
- Confirm webhook is still active.
- Verify outbound network access from the runner.
- Retry with a small failing command and check whether a notification is delivered.

## Run Is Missing in Dashboard

- Confirm `api.host_token` is set.
- Confirm `api.base_url` points to the expected API.
- Confirm `api.host_token` belongs to the workspace and host you are checking.

## `obsern` Command Not Found

- Reinstall CLI.
- Confirm binary is on `PATH`.
- Verify with:

```bash
obsern --version
```

## Environment Variables Not Applied

Verify variables in the same shell before running:

```bash
echo "$OBSERN_HOST_TOKEN"
echo "$OBSERN_SLACK_WEBHOOK_URL"
```

If empty, re-export and retry.
