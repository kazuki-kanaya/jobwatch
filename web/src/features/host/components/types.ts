import type { SnapshotMetrics, SnapshotViewState } from "@/features/snapshot";

export type HostItemData = {
  id: string;
  name: string;
  snapshot: SnapshotMetrics;
  snapshotState: Exclude<SnapshotViewState, "error"> | "error";
};

export type HostViewState = "loading" | "ready" | "empty" | "error";
