export type JobStatusUi = "running" | "completed" | "failed" | "canceled";

export type JobListItem = {
  id: string;
  workspaceId: string;
  hostId: string;
  hostName: string;
  startedAtIso: string;
  command: string;
  tags: string[];
  status: JobStatusUi;
  startedAt: string;
  finishedAt: string | null;
  duration: string;
  logs: string[];
};

export type JobViewState = "loading" | "ready" | "empty" | "error";
