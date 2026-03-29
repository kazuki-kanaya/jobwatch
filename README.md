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

It is designed to make the following easier to manage from the CLI for processes that run from hours to days.

- execution status tracking
- stdout / stderr visibility
- dashboard visibility
- notifications

In particular, Obsern is built around three practical goals:

- no changes to training code just to adopt it
- no SSH needed just to check whether a long-running job is still healthy
- one place to understand what is running across multiple servers

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
- [🚫 Non-goals](#non-goals)
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

The current installation flow assumes a Unix-like environment.

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

You need either a `host_token` or at least one notification webhook.

* You can issue a `host_token` from the dashboard:
  https://app.obsern.dev

* To create a Slack Incoming Webhook URL:
  https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks

* To create a Discord webhook URL:
  https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks

Add one of the following to `obsern.yaml`.

```yaml
# obsern.yaml

# For dashboard integration
api:
  host_token: your_token_here
  base_url: https://api.obsern.dev

# If you only want notifications, configure Slack, Discord, or both
notify:
  slack:
    webhook_url: https://hooks.slack.com/services/xxx/yyy/zzz
  discord:
    webhook_url: https://discord.com/api/webhooks/xxx/yyy
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
* when the servers were shared by a team, we had to SSH in or ask someone else to figure out which GPU server was actually available

As a result, both compute resources and time were wasted.

---

Log handling was another pain point.

When running jobs with `nohup`, logs were written to `nohup.out`.
Because tools like `tqdm` tend to generate many line updates, the file could grow very large very quickly.

That sometimes led to deleting the logs, only to later realize that the cause of the failure could no longer be traced.

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

In other words, SSH-ing in just to confirm whether a process is still alive is inefficient.

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

### 🔍 You SSH in only to check status

```bash
ssh gpu-server
ps aux | grep python
nvidia-smi
```

That kind of status-only check tends to happen over and over again.

### 🧩 State gets scattered across multiple servers

- `gpu-server-1`
- `gpu-server-2`
- `gpu-server-3`

It becomes hard to tell what is running where.

### 👥 It is hard to tell which server is free in team usage

When multiple people share GPU servers, checking which machine is currently available often means SSH-ing into each server or asking other team members just to understand where new work can be scheduled.

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

The web UI can be used to register hosts and inspect job state.
It is also designed for team usage, including member invitations and permission management.

<p align="center">
  <img src="./assets/dashboard.png" alt="Obsern Dashboard" width="450" />
</p>

### 🔔 Notifications

Obsern can notify you when jobs finish or fail.

Currently:

- Slack
- Discord

Example notifications (Slack):

<p align="center">
  <img src="./assets/slack-success.png" alt="Slack Success Notification" width="290" />
  <img src="./assets/slack-canceled.png" alt="Slack Canceled Notification" width="330" />
  <img src="./assets/slack-failed.png" alt="Slack Failed Notification" width="330" />
</p>

### 🌍 Local- and cloud-friendly

Obsern is intended to work in environments such as:

- local environments
- on-premises environments
- cloud environments

If you want dashboard integration, you need a server endpoint to connect to.

- You can run your own server and connect to it
- Or use the hosted Obsern service, which is currently available as an experimental beta and may change or become unavailable without notice

If notifications are all you need, the CLI alone is enough.

## 🚫 Non-goals

Obsern is intentionally not trying to cover everything.

- It is not a full experiment tracking platform.
- It does not require SDK integration into training code.
- It is not built around heavy always-on agents.

The scope is intentionally narrow: process monitoring and notifications for long-running jobs.

<a id="architecture"></a>
## 🏗️ Architecture

Obsern is centered around the `CLI`, which wraps arbitrary commands and can optionally be connected to the Dashboard and API when you want centralized visibility.

The main reasons for this structure are:

- The `CLI` should be useful on its own so the adoption path stays lightweight.
- The cloud side leans serverless so small-scale usage can stay within free-tier or low-cost operating ranges more easily.
- The system is meant to support both the hosted cloud path and self-hosted setups.
- Authentication logic lives in FastAPI so cloud and local environments behave more consistently.

The main components are:

- `CLI`
  - `obsern run` wraps arbitrary commands, streams output back to the terminal, keeps tail logs, reports status, and sends notifications.
  - Slack and Discord notifications are available even without the dashboard/API path.

- `Web Dashboard` / `API`
  - These are optional integrations for aggregating and managing job state centrally.
  - Reporting job state from the CLI requires a host connection token, which is only needed when dashboard integration is enabled.
  - In production, the API runs on AWS, including AWS Lambda, and the dashboard is served from Cloudflare Pages.

- `Documentation` / `Landing Page`
  - These provide the public entry points for onboarding, setup guidance, and product information.
  - In production, they are served from Cloudflare Pages.

- `Persistence / Infrastructure`
  - `DynamoDB` stores jobs, workspaces, and host data.
  - Cloudflare also handles public-edge concerns such as DNS, HTTPS, and WAF / bot mitigation.

- `Authentication`
  - Authentication is integrated with an OIDC provider.
  - JWT validation happens inside the FastAPI application rather than at API Gateway.
  - This keeps authentication behavior more consistent between cloud usage and local development.

### ☁️ Cloud Usage

<p align="center">
  <img src="./assets/architecture.prod.drawio.svg" alt="Obsern Production Architecture Overview" width="900" />
</p>

<p align="center">
  draw.io source: <a href="./assets/architecture.prod.drawio">assets/architecture.prod.drawio</a>
</p>

### 🧪 Local Usage

<p align="center">
  <img src="./assets/architecture.local.drawio.svg" alt="Obsern Local Architecture Overview" width="900" />
</p>

<p align="center">
  draw.io source: <a href="./assets/architecture.local.drawio">assets/architecture.local.drawio</a>
</p>

- In local usage, the API, Dashboard, auth provider, and data store run in a development-friendly setup.
- As in cloud usage, JWT validation still happens inside FastAPI.

<a id="comparison"></a>
## 🆚 Comparison

Obsern focuses on execution monitoring and notifications rather than experiment management.

| Tool | Training Code Changes | Notifications | Cross-Server View | Adoption Friction | Primary Use |
| --- | --- | --- | --- | --- | --- |
| MLflow | Often required | △ | △ | Medium | Experiment management |
| TensorBoard | Required | × | × | Low | Training metrics visualization |
| Airflow | DAGs required | ○ | ○ | High | Workflow orchestration |
| Obsern | Not required | ○ | ○ | Low | Long-running job monitoring |

<a id="repository-structure"></a>
## 📁 Repository Structure

This repository is organized as a monorepo.

- `cli/`
  - CLI implementation.
- `api/`
  - Backend API.
- `web/`
  - Web dashboard.
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

Recent updates:

- Added Discord notifications

Planned next steps:

- Set up a Docker-based local development environment
- Add more notification targets

If you try the beta, we would appreciate your feedback through GitHub Issues:

- [Beta Feedback](https://github.com/kazuki-kanaya/obsern/issues/new?template=beta-feedback.yaml)
- [Bug Report](https://github.com/kazuki-kanaya/obsern/issues/new?template=bug-report.yaml)
- [Feature Request](https://github.com/kazuki-kanaya/obsern/issues/new?template=feature-request.yaml)

<a id="license"></a>
## 📄 License

MIT
