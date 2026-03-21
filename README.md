<p align="center">
  <img src="./assets/logo.png" alt="Obsern Logo" width="120" />
</p>

<h1 align="center">Obsern</h1>
<p align="center">
  <a href="./README.md"><strong>English</strong></a> | <a href="./README.ja.md">日本語</a>
</p>
<p align="center">
  <img alt="Platform" src="https://img.shields.io/badge/platform-Unix-blue" />
  <img alt="CLI" src="https://img.shields.io/badge/interface-CLI-2f855a" />
  <img alt="Status" src="https://img.shields.io/badge/status-beta-f59e0b" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-111827" />
</p>
<p align="center">
  A process monitoring tool that eliminates "SSH just to check" for machine learning jobs<br />
  Multi-server friendly, lightweight, and ready to use in minutes with no SDK required
</p>
<p align="center">
  <a href="https://obsern.dev">Website</a> | <a href="https://app.obsern.dev">Dashboard</a> | <a href="https://obsern.dev/docs">Documentation</a>
</p>
<p align="center">
  <sub>The hosted Obsern service is currently available as an experimental beta and may change or become unavailable without notice.</sub>
</p>

<p align="center">
  <img src="./assets/demo.gif" alt="Obsern Demo" width="800" />
</p>

Obsern is a lightweight tool for tracking long-running jobs.

It is designed to make the following easier to handle from the CLI for processes that run from hours to days.

- execution status tracking
- stdout / stderr visibility
- dashboard visibility
- notifications

No SDK integration is required. Just wrap any command and run it.

```bash
obsern run python train.py
```

## 📚 Overview

- [📦 Installation](#installation)
- [⚡ Quick Start](#quick-start)
- [🌱 Background](#background)
- [🎯 What Obsern Solves](#what-obsern-solves)
- [✨ Key Features](#key-features)
- [🏗️ Architecture](#architecture)
- [🆚 Comparison](#comparison)
- [📁 Repository Structure](#repository-structure)
- [🛠️ Tech Stack](#tech-stack)
- [🚧 Development Status](#development-status)
- [📄 License](#license)

<a id="installation"></a>
## 📦 Installation

```bash
curl -fsSL https://github.com/kazuki-kanaya/obsern/releases/latest/download/install.sh | sh
```

The current installation path assumes a Unix-like environment.

<a id="quick-start"></a>
## ⚡ Quick Start

You can try it in about three minutes.

### 1. 🧭 Initialize

```bash
obsern init
```

This generates the following config file:

```text
obsern.yaml
```

---

### 2. 🔧 Configure

You need either `host_token` or `slack_webhook_url`.

* You can issue a `host_token` from the dashboard:
  https://app.obsern.dev

* To create a Slack Incoming Webhook URL:
  https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks

Add one of the following to `obsern.yaml`.

```yaml
# obsern.yaml

# For dashboard integration
api:
  host_token: your_token_here

# Or, if you only want notifications
notify:
  slack:
    webhook_url: https://hooks.slack.com/services/xxx/yyy/zzz
```

---

### 3. ▶️ Run a command

You can wrap and run any command as-is.

```bash
obsern run python train.py
```

Examples:

```bash
obsern run python train.py --epochs 10
obsern run -- python train.py --epochs 10
obsern run bash -lc 'echo hi && sleep 1'
```

---

Execution state is tracked while the command is running, and the result is recorded when it ends.
Depending on your configuration, completion and failure notifications can also be sent automatically.

No SDK integration or code changes are required.

<a id="background"></a>
## 🌱 Background

Running long machine learning jobs on GPU servers creates a lot of operational overhead.

In my research lab, I was running training jobs in parallel across multiple GPU servers.
A single experiment could take anywhere from one to two weeks.

In practice, the following problems came up all the time:

* jobs failed almost immediately due to CUDA OOM, wrong paths, data errors, and similar issues
* we did not notice until much later, sometimes days afterward

As a result, both compute resources and time were wasted.

---

Log handling was another pain point.

When running jobs with `nohup`, logs were written to `nohup.out`.
Because tools like `tqdm` tend to generate many line updates, the file could grow very large very quickly.

That sometimes led to deleting the logs, only to later realize the failure cause could no longer be traced.

---

In the end, status checks looked like this:

```bash
ssh gpu-server
ps aux | grep python
nvidia-smi
```

And that had to be repeated multiple times a day.

If there were several servers, the same process had to be repeated for each one.

* gpu-server-1
* gpu-server-2
* gpu-server-3

SSH into each server, run the same checks, and piece together what is happening.

The more servers there are, the more time it takes, and the harder it becomes to understand what is running where.

---

In other words, doing SSH just to confirm whether a process is alive is inefficient.

---

Obsern was built to solve this.

* check process state without SSH
* manage execution state across multiple servers in one place
* detect failures earlier and understand what happened
* receive notifications immediately when a process ends

The goal is to reduce manual checking in long-running job workflows.

<a id="what-obsern-solves"></a>
## 🎯 What Obsern Solves

Long-running jobs tend to create the same kinds of operational pain.

### 💥 You do not notice when a job dies

GPU training jobs can fail almost immediately for reasons like:

- CUDA OOM
- data errors
- wrong paths

### 🔍 You SSH only to check status

```bash
ssh gpu-server
ps aux | grep python
```

That kind of status-only check tends to happen over and over again.

### 🧩 State gets scattered across multiple servers

- `gpu-server-1`
- `gpu-server-2`
- `gpu-server-3`

It becomes hard to tell what is running where.

Obsern aims to solve this through:

- execution status tracking
- stdout / stderr collection
- dashboard visibility
- notifications

<a id="key-features"></a>
## ✨ Key Features

### ▶️ Wrap any command

You can run arbitrary CLI commands as-is.

```bash
obsern run python train.py
obsern run bash script.sh
obsern run bash -lc 'echo hi && sleep 1'
```

### 📜 stdout / stderr visibility

Obsern is designed to stream process output to the user terminal while retaining tail logs when execution ends.

This helps reduce work such as:

- checking `nohup` logs
- SSH-ing in just to inspect logs

### 🛰️ Execution status tracking

Obsern tracks job state with the following statuses:

- `running`
- `finished`
- `failed`
- `canceled`

### 🖥️ Dashboard

The Web UI can be used to register hosts and inspect job state.
It is also designed for team usage, including member invitations and permission management.

<p align="center">
  <img src="./assets/dashboard.png" alt="Obsern Dashboard" width="450" />
</p>

### 🔔 Notifications

Obsern can notify you when jobs finish or fail.

Currently:

- Slack

Planned:

- Discord

Example notifications (Slack):

<p align="center">
  <img src="./assets/slack-success.png" alt="Slack Success Notification" width="290" />
  <img src="./assets/slack-canceled.png" alt="Slack Canceled Notification" width="330" />
  <img src="./assets/slack-failed.png" alt="Slack Failed Notification" width="330" />
</p>

### 🌍 Local and cloud-friendly

Obsern is intended to work in environments such as:

- local environments
- on-premise environments
- cloud environments

If you want dashboard integration, you need a server endpoint to connect to.

- You can run your own server and connect to it
- Or use the hosted Obsern service, which is currently available as an experimental beta and may change or become unavailable without notice

If notifications are all you need, the CLI alone is enough.

<a id="architecture"></a>
## 🏗️ Architecture

Obsern is centered around the `CLI`, which wraps arbitrary commands and can optionally be connected to the Dashboard and API when you want centralized visibility.

- The `CLI` uses `obsern run` to wrap arbitrary commands, stream output back to the terminal, keep tail logs, report status, and send notifications.
- Slack notifications are part of the basic CLI-only flow.
- The `Web Dashboard` and `API` are optional integrations you add when you want to aggregate and manage job state centrally.
- Reporting job state from the `CLI` to the `API` requires a host connection token, and that token is only needed when dashboard integration is enabled.
- `DynamoDB` is the main persistence layer and stores not only jobs but also workspace and host data.
- OIDC JWT validation is handled inside the FastAPI application rather than at API Gateway. This keeps the authentication logic consistent between the production AWS setup and the local development environment.

### ☁️ Production

<p align="center">
  <img src="./assets/architecture.prod.drawio.svg" alt="Obsern Production Architecture Overview" width="900" />
</p>

<p align="center">
  draw.io source: <a href="./assets/architecture.prod.drawio">assets/architecture.prod.drawio</a>
</p>

- The API runs on AWS and the Web Dashboard is served from Cloudflare Pages.
- Authentication is integrated with an OIDC provider, and FastAPI verifies JWTs directly.

### 🧪 Local

<p align="center">
  <img src="./assets/architecture.local.drawio.svg" alt="Obsern Local Architecture Overview" width="900" />
</p>

<p align="center">
  draw.io source: <a href="./assets/architecture.local.drawio">assets/architecture.local.drawio</a>
</p>

- In local development, the API, Dashboard, auth provider, and data store run in a development-friendly setup.
- JWT validation still happens inside FastAPI, matching the production authentication path.

<a id="comparison"></a>
## 🆚 Comparison

Obsern focuses on execution monitoring and notifications rather than experiment management.

| Tool | Primary Use |
| --- | --- |
| MLflow | Experiment management |
| TensorBoard | Training metrics visualization |
| Airflow | Workflow orchestration |
| Obsern | Job execution monitoring and notifications |

<a id="repository-structure"></a>
## 📁 Repository Structure

This repository is organized as a monorepo.

- `cli/`
  - CLI implementation.
- `api/`
  - Backend API.
- `web/`
  - Web application.
- `site/`
  - Landing page and documentation site.
- `infra/`
  - Infrastructure definitions such as Terraform.
- `.github/`
  - Repository operations such as GitHub Actions workflows for CI, releases, and security checks.

<a id="tech-stack"></a>
## 🛠️ Tech Stack

| Directory | Description | Tech |
| --- | --- | --- |
| `cli` | CLI | Go / Cobra |
| `api` | Backend API | Python / FastAPI / uv |
| `web` | Web dashboard | pnpm / Vite / React |
| `site` | Docs / landing page | pnpm / Astro |
| `infra` | Infrastructure | Terraform / AWS / Cloudflare |

<a id="development-status"></a>
## 🚧 Development Status

Planned next steps:

- Add Discord notifications
- Set up a Docker-based local development environment

If you try the beta, we would appreciate your feedback through GitHub Issues:

- [Beta Feedback](https://github.com/kazuki-kanaya/obsern/issues/new?template=beta-feedback.yaml)
- [Bug Report](https://github.com/kazuki-kanaya/obsern/issues/new?template=bug-report.yaml)
- [Feature Request](https://github.com/kazuki-kanaya/obsern/issues/new?template=feature-request.yaml)

<a id="license"></a>
## 📄 License

MIT
