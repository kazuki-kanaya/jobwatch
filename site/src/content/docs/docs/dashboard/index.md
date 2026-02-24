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

<ol class="step-flow">
  <li>
    <h3>Initial dashboard (before workspace)</h3>
    <p>Open the dashboard after account creation and verify your session is active.</p>
    <img src="/docs/dashboard/flow-01-initial.png" alt="Initial dashboard before workspace creation" width="1100" />
  </li>
  <li>
    <h3>Workspace creation</h3>
    <p>Create a workspace to define the scope for hosts, jobs, and member access.</p>
    <img src="/docs/dashboard/flow-02-workspace-create.png" alt="Workspace creation dialog" width="1100" />
  </li>
  <li>
    <h3>Host creation and token one-time display</h3>
    <p>Create a host in the workspace, then copy and store the token shown once.</p>
    <img src="/docs/dashboard/flow-03-host-create.png" alt="Host creation dialog" width="1000" />
    <img src="/docs/dashboard/flow-04-token-once.png" alt="One-time host token displayed after host creation" width="1100" />
  </li>
  <li>
    <h3>Jobs and details</h3>
    <p>Run commands via Obsern and confirm status, metadata, and logs in the jobs panel.</p>
    <img src="/docs/dashboard/flow-05-jobs-detail.png" alt="Job list and job detail view" width="920" />
  </li>
  <li>
    <h3>Member invitations and role state</h3>
    <p>Invite members and check role assignment for collaboration and access control.</p>
    <img src="/docs/dashboard/members-03-after-invite.png" alt="Members and invitation result with viewer role" width="1100" />
  </li>
</ol>
