---
title: Slack Alert Setup Example
description: Minimal Slack webhook notification setup.
---

Add a Slack webhook to `obsern.yaml` to receive immediate failure alerts.

```yaml
notifications:
  slack:
    webhook_url: https://hooks.slack.com/services/xxx/yyy/zzz
```
