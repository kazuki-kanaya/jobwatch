<p align="center">
  <img src="./assets/logo.png" alt="Obsern Logo" width="120" />
</p>

<h1 align="center">Obsern</h1>
<p align="center">
  <a href="./README.md"><strong>English</strong></a> | <a href="./README.ja.md">日本語</a>
</p>
<p align="center">
A lightweight, easy-to-adopt process monitoring tool focused on execution tracking and notifications. It eliminates the need to SSH in just to check whether a process is still running.
</p>

Obsern is a tool for lightweight monitoring of long-running jobs.

It is designed for processes that run from hours to days, such as machine learning training, inference batches, and data processing. The goal is to make the following easier to handle from a CLI-first workflow:

- execution status tracking
- stdout / stderr visibility
- dashboard-based visibility
- notifications

Obsern works by wrapping arbitrary commands.

## Overview

- [Background](#background)
- [What Obsern Solves](#what-obsern-solves)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Comparison](#comparison)
- [Repository Structure](#repository-structure)
- [Tech Stack](#tech-stack)
- [Development Status](#development-status)
- [License](#license)

```bash
obsern run python train.py
```

No SDK integration or code changes are required.

## Background

Obsern was born out of day-to-day GPU server operations in a research lab.

While running machine learning jobs in parallel across multiple GPU servers, the same problems kept coming up:

- one training run could take a week
- but some jobs failed within the first five minutes
- because they ran in the background, the failure reason was not immediately visible
- in practice, that meant SSH-ing into servers multiple times a day just to check processes

In other words, "SSH just to see whether a job is still alive" became routine.

Obsern was created to reduce that wasted waiting time and manual checking in long-running job workflows.

## What Obsern Solves

Long-running jobs tend to create the same kinds of operational pain.

### You do not notice when a job dies

GPU training jobs can fail almost immediately for reasons like:

- CUDA OOM
- data errors
- wrong paths or environment setup

### You SSH only to check status

```bash
ssh gpu-server
ps aux | grep python
```

That kind of status-only check tends to happen over and over again.

### State gets scattered across multiple servers

- `gpu-server-1`
- `gpu-server-2`
- `gpu-server-3`

It becomes hard to tell what is running where.

Obsern aims to solve this through:

- execution status tracking
- stdout / stderr collection
- dashboard visibility
- notifications

## Key Features

### Wrap any command

You can run arbitrary CLI commands as-is.

```bash
obsern run python train.py
obsern run bash script.sh
obsern run bash -lc 'echo hi && sleep 1'
```

### stdout / stderr visibility

Obsern is designed to forward process output to the user terminal while retaining tail logs when execution ends.

This helps reduce work such as:

- checking `nohup` logs
- SSH-ing in just to inspect logs

### Execution status tracking

Obsern tracks job state with the following statuses:

- `running`
- `finished`
- `failed`
- `canceled`

### Dashboard

The Web UI can be used to register hosts and inspect job state.
It is also designed for team usage, including member invitations and permission management.

<p align="center">
  <img src="./assets/dashboard.png" alt="Obsern Dashboard" width="450" />
</p>

### Notifications

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

### Local and cloud-friendly

Obsern is intended to work in environments such as:

- local machines
- on-premise servers
- cloud environments such as AWS

If you want dashboard integration, you need a server endpoint to connect to.

- You can run your own server
- Or use the hosted Obsern service when it becomes available

If notifications are all you need, the goal is to make the CLI useful on its own.

## Architecture

Obsern is centered around the `CLI`, which wraps arbitrary commands and can optionally be connected to the dashboard and API when you want centralized visibility.

- The `CLI` uses `obsern run` to wrap arbitrary commands, stream output back to the terminal, keep tail logs, report status, and send notifications.
- Slack notifications are part of the basic CLI-only flow.
- The `Web Dashboard` and `API` are optional integrations you add when you want to aggregate and manage job state centrally.
- Reporting job state from the `CLI` to the `API` requires a host connection token, and that token is only needed when dashboard integration is enabled.
- `DynamoDB` is the main persistence layer and stores not only jobs but also workspace and host data.
- OIDC JWT validation is handled inside the FastAPI application rather than at API Gateway. This keeps the authentication logic consistent between the production AWS setup and the local development environment.

### Production

<p align="center">
  <img src="./assets/architecture.prod.drawio.svg" alt="Obsern Production Architecture Overview" width="900" />
</p>

<p align="center">
  draw.io source: <a href="./assets/architecture.prod.drawio">assets/architecture.prod.drawio</a>
</p>

- In production, the API runs on AWS and the Web Dashboard is served from Cloudflare Pages.
- Authentication is integrated with an OIDC provider, and JWTs are verified by FastAPI itself.

### Local

<p align="center">
  <img src="./assets/architecture.local.drawio.svg" alt="Obsern Local Architecture Overview" width="900" />
</p>

<p align="center">
  draw.io source: <a href="./assets/architecture.local.drawio">assets/architecture.local.drawio</a>
</p>

- In local development, the API, dashboard, auth provider, and data store run in a development-friendly setup.
- JWT validation still happens inside FastAPI, matching the production authentication path.

## Installation

### Latest

```bash
curl -fsSL https://github.com/kazuki-kanaya/obsern/releases/latest/download/install.sh | sh
```

### Specific version

```bash
# Replace vX.Y.Z with the desired release tag (for example, v1.2.3)
curl -fsSL https://github.com/kazuki-kanaya/obsern/releases/vX.Y.Z/download/install.sh | sh
```

The current installation path assumes a Unix-like environment.

## Quick Start

### Initialize config

```bash
obsern init
```

Config file:

```text
obsern.yaml
```

### Run a command

```bash
obsern run python train.py
```

Examples:

```bash
obsern run python train.py --epochs 10
obsern run -- python train.py --epochs 10
obsern run bash -lc 'echo hi && sleep 1'
```

## Comparison

Obsern focuses on execution monitoring rather than experiment management.

| Tool | Primary Use |
| --- | --- |
| MLflow | Experiment management |
| TensorBoard | Training metrics visualization |
| Airflow | Workflow orchestration |
| Obsern | Job monitoring and notifications |


## Repository Structure

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

## Tech Stack

| Directory | Description | Tech |
| --- | --- | --- |
| `cli` | CLI | Go / Cobra |
| `api` | Backend API | Python / FastAPI / uv |
| `web` | Web dashboard | pnpm / Vite / React |
| `site` | Docs / landing page | pnpm / Astro |
| `infra` | Infrastructure | Terraform |

## Development Status

Planned next steps:

- Add Discord notifications
- Set up a Docker-based local development environment

## License

MIT
