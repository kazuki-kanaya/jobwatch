---
title: Dashboard Guide
description: Dashboard overview and core workflow.
---

## Core Concepts

- `Workspace`: A team boundary. Members, hosts, and jobs are managed per workspace. You can create multiple workspaces.
- `Host`: A machine/execution source that belongs to one workspace. Create a host in the dashboard and use its one-time token in `obsern.yaml`.
- `Job`: One process execution record sent by `obsern run <command>`. Each job includes process status, duration, logs, and command context.

Relationship:

- One workspace has multiple hosts.
- One host can produce multiple jobs.
- Jobs are viewed and managed inside their workspace.

Use this flow when onboarding a new workspace:

1. Open dashboard after account creation.
2. Create workspace.
3. Create host and copy the one-time token.
4. Confirm jobs are arriving.
5. Invite members and assign roles.

## Flow Screens

1) Initial dashboard (before workspace)

<img src="/docs/dashboard/flow-01-initial.png" alt="Initial dashboard before workspace creation" width="1100" />

2) Workspace creation

<img src="/docs/dashboard/flow-02-workspace-create.png" alt="Workspace creation dialog" width="1100" />

3) Host creation and token one-time display

<img src="/docs/dashboard/flow-03-host-create.png" alt="Host creation dialog" width="1000" />

<img src="/docs/dashboard/flow-04-token-once.png" alt="One-time host token displayed after host creation" width="1100" />

4) Jobs and details

<img src="/docs/dashboard/flow-05-jobs-detail.png" alt="Job list and job detail view" width="920" />

5) Member invitations and role state

<img src="/docs/dashboard/members-03-after-invite.png" alt="Members and invitation result with viewer role" width="1100" />
