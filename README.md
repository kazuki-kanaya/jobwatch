# Obsern

> Lightweight job monitoring for long-running ML/compute experiments.

Obsern is a simple tool to monitor long-running scripts on GPU servers or cloud machines.
It helps you track whether jobs are running, finished, or failed — without constantly SSH-ing into servers.

This project is in early development.

---

## ✨ Motivation

When running machine learning experiments on remote servers, common problems are:

- Jobs fail (e.g., CUDA OOM) and you notice too late
- You forget whether a job is still running
- Results and logs are scattered across multiple servers
- Checking status requires repeated SSH access

Existing tools like MLflow or TensorBoard are powerful, but often heavy if you just want:

- Simple status tracking
- Notifications
- Lightweight monitoring across servers

Obsern aims to be a minimal, easy-to-adopt solution.

---

## 🚀 Concept

Wrap your command with obsern:

```bash
obsern run python main.py
```

Obsern tracks:

- Running
- Completed
- Failed
- Cancelled

And syncs job states to a web dashboard.

**Deploy anywhere**: Works seamlessly in local Docker, cloud environments (AWS, GCP, Azure), or on-premise GPU servers.

---

## 🧩 Planned Features

- CLI wrapper for any script
- Job status tracking
- Web dashboard for monitoring
- Multi-server visibility
- Flexible deployment (Docker, Kubernetes)
- Cloud-native support (AWS, GCP, Azure)
- Notifications (e.g., Slack)
- Log collection for failures

---

## 📦 Installation

Install latest:

```bash
curl -fsSL https://raw.githubusercontent.com/kazuki-kanaya/obsern/main/install.sh | sh
```

Install a specific version:

```bash
curl -fsSL https://raw.githubusercontent.com/kazuki-kanaya/obsern/main/install.sh | sh -s -- v2026.02.26
```

---

## 🛠 Current Status

⚠️ Early prototype

Features and APIs may change.
Feedback and ideas are welcome.

---

## 🎯 Goals

Obsern is designed to be:

- Lightweight
- Easy to adopt
- Flexible deployment (local Docker, cloud, on-premise)
- Focused on monitoring & notification
- Complementary to MLflow/TensorBoard (not a replacement)

---

## 🤝 Contributing

Contributions, suggestions, and issues are welcome.

If you have ideas or pain points from ML experimentation workflows, please open an issue.

---

## 🛠️ Development Setup

### Prerequisites

- Python 3.11 (via [uv](https://docs.astral.sh/uv/))
- Node.js 22+ (via [pnpm](https://pnpm.io/))
- Go 1.25.7 (via [goenv](https://github.com/go-nv/goenv))
- Terraform (via [tfenv](https://github.com/tfutils/tfenv))
- Docker & Docker Compose 

### Install Dependencies

- **Task** (task runner): [taskfile.dev/installation](https://taskfile.dev/installation)
- **Lefthook** (git hooks): [lefthook.dev/installation](https://lefthook.dev/installation)
- **AWS CLI** (for LocalStack): [AWS CLI installation](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- **GoReleaser** (release automation): [goreleaser.com/install](https://goreleaser.com/install/)

After installing Lefthook, run:

```bash
lefthook install
```

Note: LocalStack emulates AWS services locally. See [docs.localstack.cloud](https://docs.localstack.cloud/) for details.

---

## 📜 License

MIT

---

## 🙌 Author

Built by ML practitioners for ML practitioners.

If this project helps you, a star ⭐ is appreciated.
