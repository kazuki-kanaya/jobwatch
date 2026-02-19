# Jobwatch

> Lightweight job monitoring for long-running ML/compute experiments.

Jobwatch is a simple tool to monitor long-running scripts on GPU servers or cloud machines.
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

Jobwatch aims to be a minimal, easy-to-adopt solution.

---

## 🚀 Concept

Wrap your command with Jobwatch:

```bash
jobwatch run python main.py
```

Jobwatch tracks:

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

*(Coming soon)*

Example future flow:

```bash
pip install jobwatch
```

---

## 🛠 Current Status

⚠️ Early prototype

Features and APIs may change.
Feedback and ideas are welcome.

---

## 🎯 Goals

Jobwatch is designed to be:

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

After installing Lefthook, run:

```bash
lefthook install
```

### Start Local Services

```bash
# Start LocalStack (AWS emulator)
task ddb:up

# Start API server
task api:dev
```

Note: LocalStack emulates AWS services locally. See [docs.localstack.cloud](https://docs.localstack.cloud/) for details.

---

## 📜 License

MIT

---

## 🙌 Author

Built by ML practitioners for ML practitioners.

If this project helps you, a star ⭐ is appreciated.
