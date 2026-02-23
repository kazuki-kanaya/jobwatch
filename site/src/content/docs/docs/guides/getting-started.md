---
title: はじめに
description: Jobwatch を最短でセットアップする手順。
---

## 1. CLI をインストール

```bash
brew tap kazuki-kanaya/jobwatch && brew install jobwatch
```

## 2. 初期設定

```bash
jobwatch init
```

## 3. コマンドをラップして実行

```bash
jobwatch run python train_model.py --epochs 100
```

完了・失敗はダッシュボードや通知先から確認できます。
