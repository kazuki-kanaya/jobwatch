export type JobStatusUi = "running" | "completed" | "failed" | "canceled";

export type JobListItem = {
  id: string;
  project: string;
  workspaceId: string;
  hostId: string;
  startedAtIso: string;
  fullCommand: string;
  command: string;
  args: string[];
  tags: string[];
  status: JobStatusUi;
  startedAt: string;
  finishedAt: string | null;
  duration: string;
  errorMessage: string | null;
  logs: string[];
};

export type JobViewState = "loading" | "ready" | "empty" | "error";
