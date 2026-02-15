// Responsibility: Define view-facing DTOs for dashboard skeleton rendering.
export type JobStatus = "running" | "completed" | "failed" | "queued";

export type JobListItem = {
  id: string;
  title: string;
  workspace: string;
  host: string;
  startedAt: string;
  status: JobStatus;
};

export type DashboardSnapshot = {
  total: number;
  running: number;
  completed: number;
  failed: number;
  updatedAt: string;
};

export type DashboardViewModel = {
  title: string;
  subtitle: string;
  texts: {
    missionControl: string;
    updatedAt: string;
    refresh: string;
    alertRules: string;
    filters: string;
    apply: string;
    recentJobs: string;
    noJobs: string;
    jobsError: string;
    detail: string;
    selectedJob: string;
    latestLogs: string;
    snapshotTracked: string;
    snapshotRunning: string;
    snapshotCompleted: string;
    snapshotFailed: string;
    statusLabels: Record<JobStatus, string>;
  };
  filters: {
    workspace: string;
    host: string;
    query: string;
  };
  snapshot: DashboardSnapshot;
  jobs: JobListItem[];
};
