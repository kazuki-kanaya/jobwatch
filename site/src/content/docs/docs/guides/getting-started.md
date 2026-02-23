---
title: はじめに
description: Obsern を最短でセットアップする手順。
---

## 1. CLI をインストール

```bash
brew tap kazuki-kanaya/obsern && brew install obsern
```

## 2. 初期設定

```bash
obsern init
```

## 3. コマンドをラップして実行

```bash
obsern run python train_model.py --epochs 100
```

完了・失敗はダッシュボードや通知先から確認できます。
