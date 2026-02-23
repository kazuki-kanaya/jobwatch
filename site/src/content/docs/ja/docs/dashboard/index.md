---
title: Dashboard Guide
description: Dashboard の全体フローと主要機能。
---

## 用語の意味

- `Workspace`: チーム運用の単位です。メンバー、ホスト、ジョブはワークスペースごとに管理されます。ワークスペースは複数作成できます。
- `Host`: 1つのワークスペースに紐づく実行元マシンです。Dashboard でホストを作成し、一度きり表示されるトークンを `obsern.yaml` に設定します。
- `Job`: `obsern run <command>` で送信される1プロセス分の実行記録です。プロセスのステータス、実行時間、ログ、コマンド情報を含みます。

関係性:

- 1つのワークスペースに複数ホストを登録できる
- 1つのホストから複数ジョブが送信される
- ジョブは所属ワークスペース内で確認・管理する

新規運用時は次の流れで進めます。

1. アカウント作成後に Dashboard を開く
2. ワークスペース作成
3. ホスト作成と一度きり表示トークンの保存
4. ジョブ到着確認
5. メンバー招待とロール設定

## フロー画面

1) 初期画面（ワークスペース作成前）

<img src="/docs/dashboard/flow-01-initial.png" alt="ワークスペース作成前の初期ダッシュボード画面" width="1100" />

2) ワークスペース作成

<img src="/docs/dashboard/flow-02-workspace-create.png" alt="ワークスペース作成ダイアログ" width="1100" />

3) ホスト作成とトークン一度きり表示

<img src="/docs/dashboard/flow-03-host-create.png" alt="ホスト作成ダイアログ" width="1000" />

<img src="/docs/dashboard/flow-04-token-once.png" alt="ホスト作成後の一度きりトークン表示" width="1100" />

4) ジョブ一覧と詳細

<img src="/docs/dashboard/flow-05-jobs-detail.png" alt="ジョブ一覧と詳細パネル" width="920" />

5) メンバー招待とロール反映

<img src="/docs/dashboard/members-03-after-invite.png" alt="招待後のメンバー一覧と viewer ロール表示" width="1100" />
