---
title: Hosts & Tokens
description: Create hosts and issue tokens.
---

Hosts are created under a workspace.

## Create Host

1. Open the target workspace.
2. In `Hosts`, click `+ Add`.
3. Enter host name and create.

<img src="/docs/dashboard/flow-03-host-create.png" alt="Host creation dialog in workspace" width="1000" />

## Token Issuance Rule

When host creation completes, a host token is shown once.

- Copy immediately.
- Store in secret management or env vars.
- If lost, delete the host and create it again to issue a new token.

<img src="/docs/dashboard/flow-04-token-once.png" alt="One-time host token warning and copy button" width="1100" />

## Configure CLI

```yaml
api:
  host_token: ${OBSERN_HOST_TOKEN}
  base_url: https://api.obsern.dev
```

```bash
export OBSERN_HOST_TOKEN="<issued-token>"
```
