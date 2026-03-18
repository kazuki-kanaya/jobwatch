import { useMemo } from "react";
import type { SnapshotMetrics, SnapshotViewState } from "@/features/snapshot/components/types";
import { JobStatus } from "@/generated/api";

type SnapshotJob = {
  status: JobStatus;
};

type UseSnapshotViewModelParams = {
  workspaceId: string;
  jobs: SnapshotJob[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

const EMPTY_SNAPSHOT: SnapshotMetrics = {
  tracked: 0,
  running: 0,
  completed: 0,
  canceled: 0,
  failed: 0,
};

export const useSnapshotViewModel = ({ workspaceId, jobs, isLoading, isError }: UseSnapshotViewModelParams) => {
  const snapshot = useMemo<SnapshotMetrics>(() => {
    if (!workspaceId) return EMPTY_SNAPSHOT;

    const jobItems = jobs ?? [];
    return jobItems.reduce<SnapshotMetrics>(
      (acc, job) => {
        acc.tracked += 1;
        if (job.status === JobStatus.running) acc.running += 1;
        if (job.status === JobStatus.finished) acc.completed += 1;
        if (job.status === JobStatus.canceled) acc.canceled += 1;
        if (job.status === JobStatus.failed) acc.failed += 1;
        return acc;
      },
      { tracked: 0, running: 0, completed: 0, canceled: 0, failed: 0 },
    );
  }, [workspaceId, jobs]);

  const viewState: SnapshotViewState = !workspaceId ? "ready" : isLoading ? "loading" : isError ? "error" : "ready";

  return {
    snapshot,
    viewState,
  };
};
