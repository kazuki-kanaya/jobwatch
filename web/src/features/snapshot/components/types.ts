export type SnapshotMetrics = {
  tracked: number;
  running: number;
  completed: number;
  canceled: number;
  failed: number;
};

export type SnapshotViewState = "loading" | "ready" | "error";
