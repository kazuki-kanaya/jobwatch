// Responsibility: Map API models into dashboard view DTOs.

import type {
  DashboardCurrentUser,
  DashboardInvitationItem,
  DashboardMemberItem,
  JobListItem,
  JobStatus,
} from "@/features/dashboard/types";
import type {
  HostResponse,
  JobResponse,
  UserResponse,
  UserWorkspacesResponse,
  WorkspaceInvitationsResponse,
  WorkspaceMemberResponse,
  WorkspaceMembersResponse,
} from "@/generated/api";

export type WorkspaceOption = {
  id: string;
  name: string;
};

export type HostOption = {
  id: string;
  name: string;
};

const statusMap: Record<JobResponse["status"], JobStatus> = {
  RUNNING: "running",
  FINISHED: "completed",
  FAILED: "failed",
  CANCELED: "queued",
};

const toReadableDateTime = (value: string, localeTag: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString(localeTag, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
};

const toUserDisplayName = (userId: string, userNameById: Map<string, string>) => {
  const userName = userNameById.get(userId);
  return userName ? `${userName} (${userId})` : userId;
};

const toDurationLabel = (startedAt: string, finishedAt: string | null) => {
  const startedDate = new Date(startedAt);
  if (Number.isNaN(startedDate.getTime())) return "-";

  const endDate = finishedAt ? new Date(finishedAt) : new Date();
  if (Number.isNaN(endDate.getTime())) return "-";

  const diffMs = Math.max(0, endDate.getTime() - startedDate.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

export const toWorkspaceOptions = (payload?: UserWorkspacesResponse): WorkspaceOption[] => {
  if (!payload) return [];

  return payload.workspaces.map((workspace) => ({
    id: workspace.workspace_id,
    name: workspace.name,
  }));
};

export const toHostOptions = (payload?: HostResponse[]): HostOption[] => {
  if (!payload) return [];

  return payload.map((host) => ({
    id: host.host_id,
    name: host.name,
  }));
};

export const toMemberItems = (payload?: WorkspaceMembersResponse): DashboardMemberItem[] => {
  if (!payload) return [];

  return payload.members.map((member: WorkspaceMemberResponse) => ({
    userId: member.user_id,
    userName:
      (member as unknown as { username?: string; name?: string }).username ??
      (member as unknown as { username?: string; name?: string }).name ??
      null,
    role: member.role,
  }));
};

export const toCurrentUser = (payload?: UserResponse): DashboardCurrentUser | null => {
  if (!payload) return null;

  return {
    userId: payload.user_id,
    name: payload.name,
  };
};

export const toInvitationItems = (
  payload: WorkspaceInvitationsResponse | undefined,
  localeTag: string,
  userNameById: Map<string, string>,
): DashboardInvitationItem[] => {
  if (!payload) return [];

  return payload.invitations.map((invitation) => ({
    id: invitation.invitation_id,
    role: invitation.role,
    createdBy: toUserDisplayName(invitation.created_by_user_id, userNameById),
    createdByUserId: invitation.created_by_user_id,
    expiresAtIso: invitation.expires_at,
    expiresAt: toReadableDateTime(invitation.expires_at, localeTag),
    usedAt: invitation.used_at ? toReadableDateTime(invitation.used_at, localeTag) : null,
  }));
};

export const toJobListItems = (
  payload: JobResponse[] | undefined,
  workspaceLabel: string,
  hostNameById: Map<string, string>,
  localeTag: string,
): JobListItem[] => {
  if (!payload) return [];

  return payload.map((job) => ({
    id: job.job_id,
    jobId: job.job_id,
    workspaceId: job.workspace_id,
    hostId: job.host_id,
    title: job.project,
    project: job.project,
    workspace: workspaceLabel,
    host: hostNameById.get(job.host_id) ?? job.host_id,
    startedAtIso: job.started_at,
    finishedAtIso: job.finished_at ?? null,
    startedAt: toReadableDateTime(job.started_at, localeTag),
    finishedAt: job.finished_at ? toReadableDateTime(job.finished_at, localeTag) : null,
    duration: toDurationLabel(job.started_at, job.finished_at ?? null),
    status: statusMap[job.status],
    command: job.command,
    args: job.args ?? [],
    tags: job.tags ?? [],
    errorMessage: job.err ?? null,
    tailLines: job.tail_lines ?? [],
  }));
};
