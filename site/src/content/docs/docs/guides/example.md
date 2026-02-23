---
title: Slack 通知の設定例
description: Slack Webhook 通知の最小設定。
---

`obsern.yaml` の通知設定に Slack Webhook URL を追加すると、失敗時に即時通知できます。

```yaml
notifications:
  slack:
    webhook_url: https://hooks.slack.com/services/xxx/yyy/zzz
```
