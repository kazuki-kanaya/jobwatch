<p align="center">
  <img src="./assets/logo.png" alt="Obsern Logo" width="120" />
</p>

<h1 align="center">Obsern</h1>
<p align="center">
  <a href="./README.md">English</a> | <a href="./README.ja.md"><strong>日本語</strong></a>
</p>
<p align="center">
  監視と通知に特化した、軽量で導入しやすいプロセス監視ツール。プロセス生存確認のための SSH を不要にします。
</p>
<p align="center">
  <a href="https://obsern.dev">Website</a> | <a href="https://app.obsern.dev">Dashboard</a> | <a href="https://obsern.dev/docs">Documentation</a>
</p>
<p align="center">
  <sub>Obsern 公式サーバーは現在 β 版として試験的に提供中であり、予告なく停止・変更される場合があります。</sub>
</p>

Obsern は、長時間ジョブの実行状態を軽量に追跡するためのツールです。

機械学習トレーニング、推論バッチ、データ処理など、数時間から数日かかるプロセスを対象に、次のことを CLI ベースで扱いやすくすることを目指しています。

- 実行状態の追跡
- stdout / stderr の把握
- ダッシュボードによる可視化
- 通知

Obsern は任意のコマンドをラップするだけで利用できます。

## 目次

- [背景](#背景)
- [Obsern が解決したいこと](#obsern-が解決したいこと)
- [主な機能](#主な機能)
- [アーキテクチャ](#アーキテクチャ)
- [インストール](#インストール)
- [クイックスタート](#クイックスタート)
- [他ツールとの比較](#他ツールとの比較)
- [リポジトリ構成](#リポジトリ構成)
- [技術スタック](#技術スタック)
- [開発状況](#開発状況)
- [ライセンス](#ライセンス)

```bash
obsern run python train.py
```

SDK の導入やコード変更は不要です。

## 背景

Obsern は、研究室の GPU サーバー運用の中で生まれました。

機械学習の学習ジョブを複数 GPU サーバーで並列実行していたとき、次のような問題が頻繁に発生しました。

- 1つの学習に 1 週間かかる
- しかし、最初の 5 分で落ちていることもある
- バックグラウンド実行のため、失敗理由がすぐ分からない
- 結局、1 日に何度も SSH してプロセスを確認する

つまり、「ただ生きているか確認するだけの SSH」が日常になっていました。

Obsern は、このような長時間ジョブ運用における無駄な待ち時間と手動確認を減らすために作られました。

## Obsern が解決したいこと

長時間ジョブ運用では、次のような問題が起きがちです。

### ジョブが落ちても気づかない

GPU 学習では、次のような理由で開始直後に落ちることがあります。

- CUDA OOM
- データエラー
- パスミス

### 状態確認のためだけに SSH する

```bash
ssh gpu-server
ps aux | grep python
```

こうした確認を何度も繰り返す必要があります。

### 複数サーバーで状態が散らばる

- `gpu-server-1`
- `gpu-server-2`
- `gpu-server-3`

どこで何が動いているのか把握しづらくなります。

Obsern は、次の機能によってこれらの問題を解決することを目指しています。

- 実行状態追跡
- stdout / stderr の収集
- ダッシュボード可視化
- 通知

## 主な機能

### 任意コマンドのラップ実行

任意の CLI コマンドをそのまま実行できます。

```bash
obsern run python train.py
obsern run bash script.sh
obsern run bash -lc 'echo hi && sleep 1'
```

### stdout / stderr の把握

Obsern は、実行中の出力をユーザー端末に流しつつ、終了時には末尾ログを保持できるようにする方針です。

これにより、次のような作業を減らせます。

- `nohup` ログの確認
- SSH してからのログ確認

### 実行状態の追跡

ジョブの状態を追跡します。

扱う状態:

- `running`
- `finished`
- `failed`
- `canceled`

### ダッシュボード

Web UI からホストの登録やジョブ状態の確認ができます。
チーム利用も想定しており、メンバー招待や権限管理にも対応しています。

<p align="center">
  <img src="./assets/dashboard.png" alt="Obsern Dashboard" width="450" />
</p>

### 通知

ジョブの完了や失敗を通知できます。

現在:

- Slack

今後実装対象:

- Discord

通知例（Slack）：

<p align="center">
  <img src="./assets/slack-success.png" alt="Slack Success Notification" width="290" />
  <img src="./assets/slack-canceled.png" alt="Slack Canceled Notification" width="330" />
  <img src="./assets/slack-failed.png" alt="Slack Failed Notification" width="330" />
</p>

### ローカル / クラウド両対応

Obsern は次のような環境で利用できます。

- ローカル環境
- オンプレミス
- AWS などのクラウド環境

ダッシュボード連携を使う場合は、接続先のサーバーが必要です。

- 自前でサーバーを用意して接続する
- もしくは、β 版として試験的に提供中の Obsern 公式サーバーを利用する（予告なく停止・変更される場合があります）

一方、通知機能だけであれば、CLI をインストールするだけで利用できます。

## アーキテクチャ

Obsern は、`CLI` を中心に任意コマンドをラップ実行し、必要に応じて Dashboard / API 連携を追加できる構成です。

- `CLI` は `obsern run` で任意コマンドをラップ実行し、出力中継、末尾ログ保持、状態送信、通知を担当します。
- `Slack` 通知までは `CLI` 単体で使える基本フローです。
- `Web Dashboard` と `API` は、ジョブ状態を集約して見たいときに追加する任意の連携です。
- `CLI` から `API` への状態送信にはホスト接続トークンが必要ですが、これはダッシュボード連携を使う場合だけ必要です。
- 永続化の中心は `DynamoDB` で、ジョブだけでなくワークスペースやホスト情報もここで管理します。
- OIDC の JWT 検証は API Gateway ではなく FastAPI 本体で行います。これにより、本番の AWS 構成だけでなく、ローカル実行環境でも同じ認証ロジックを保てます。

### 本番構成

<p align="center">
  <img src="./assets/architecture.prod.drawio.svg" alt="Obsern Production Architecture Overview" width="900" />
</p>

<p align="center">
  draw.io source: <a href="./assets/architecture.prod.drawio">assets/architecture.prod.drawio</a>
</p>

- API は AWS 上で動作し、Web Dashboard は Cloudflare Pages から配信されます。
- 認証は OIDC プロバイダと連携し、FastAPI が JWT を検証します。

### ローカル構成

<p align="center">
  <img src="./assets/architecture.local.drawio.svg" alt="Obsern Local Architecture Overview" width="900" />
</p>

<p align="center">
  draw.io source: <a href="./assets/architecture.local.drawio">assets/architecture.local.drawio</a>
</p>

- ローカルでは API / Dashboard / 認証基盤 / データストアを開発用構成で起動します。
- 本番と同じく、JWT 検証は FastAPI 側で行います。

## インストール

### 最新版

```bash
curl -fsSL https://github.com/kazuki-kanaya/obsern/releases/latest/download/install.sh | sh
```

### 特定バージョン

```bash
# vX.Y.Z をインストールしたいバージョンタグに置き換えてください
curl -fsSL https://github.com/kazuki-kanaya/obsern/releases/vX.Y.Z/download/install.sh | sh
```

現在の配布導線は Unix 系環境を前提としています。

## クイックスタート

### 初期設定

```bash
obsern init
```

設定ファイル:

```text
obsern.yaml
```

### コマンド実行

```bash
obsern run python train.py
```

例:

```bash
obsern run python train.py --epochs 10
obsern run -- python train.py --epochs 10
obsern run bash -lc 'echo hi && sleep 1'
```

## 他ツールとの比較

Obsern は、実験管理ではなく実行監視と通知に特化しています。

| ツール | 主な用途 |
| --- | --- |
| MLflow | 実験管理 |
| TensorBoard | 学習メトリクスの可視化 |
| Airflow | ワークフローのオーケストレーション |
| Obsern | ジョブ実行監視・通知 |


## リポジトリ構成

このリポジトリはモノレポ構成です。

- `cli/`
  - CLI 実装。
- `api/`
  - バックエンド API。
- `web/`
  - Web アプリケーション。
- `site/`
  - ランディングページ・ドキュメントページ。
- `infra/`
  - Terraform などのインフラ定義。
- `.github/`
  - GitHub Actions の workflow や、CI、リリース、セキュリティチェックに関するリポジトリ運用設定。

## 技術スタック

| Directory | Description | Tech |
| --- | --- | --- |
| `cli` | CLI | Go / Cobra |
| `api` | Backend API | Python / FastAPI / uv |
| `web` | Web dashboard | pnpm / Vite / React |
| `site` | Docs / Landing page | pnpm / Astro |
| `infra` | Infrastructure | Terraform / AWS / Cloudflare |

## 開発状況

今後予定している内容:

- Discord 通知の追加
- Docker によるローカル実行環境の整備

## ライセンス

MIT
