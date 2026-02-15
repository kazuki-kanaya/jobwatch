// Responsibility: Map API models into dashboard view DTOs.

import type { JobListItem, JobStatus } from "@/features/dashboard/types";
import type { HostResponse, JobResponse, UserWorkspacesResponse } from "@/generated/models/index.zod";

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

const toReadableDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
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

export const toJobListItems = (
  payload: JobResponse[] | undefined,
  workspaceLabel: string,
  hostLabel: string,
): JobListItem[] => {
  if (!payload) return [];

  return payload.map((job) => ({
    id: job.job_id,
    title: job.project,
    workspace: workspaceLabel,
    host: hostLabel,
    startedAt: toReadableDateTime(job.started_at),
    status: statusMap[job.status],
  }));
};
