---
title: Getting Started
description: Fast setup flow for Jobwatch.
---

## 1. Install CLI

```bash
brew tap kazuki-kanaya/jobwatch && brew install jobwatch
```

## 2. Initialize config

```bash
jobwatch init
```

## 3. Wrap your command

```bash
jobwatch run python train_model.py --epochs 100
```

You can check completion/failure from dashboard and notifications.
