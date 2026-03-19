---
title: Hosts & Tokens
description: ホスト作成とトークン発行。
---

ホストはワークスペース配下で作成します。

## ホスト作成

1. 対象ワークスペースを開く
2. `Hosts` の `+ Add` を押す
3. ホスト名を入力して作成

<img src="/docs/dashboard/flow-03-host-create.png" alt="ワークスペース内のホスト作成ダイアログ" width="1000" />

## トークン発行ルール

作成完了時にホストトークンが一度だけ表示されます。

- その場でコピー
- シークレット/環境変数へ保管
- 紛失時はホストを削除して再生成してください

<img src="/docs/dashboard/flow-04-token-once.png" alt="一度きりトークン表示と Copy ボタン" width="1100" />

## CLI 設定例

```yaml
api:
  host_token: ${OBSERN_HOST_TOKEN}
  base_url: https://api.obsern.dev
```

```bash
export OBSERN_HOST_TOKEN="<issued-token>"
```
