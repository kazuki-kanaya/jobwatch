import { useMemo } from "react";
import type { SnapshotMetrics, SnapshotViewState } from "@/features/snapshot/components/types";
import { buildSnapshotMetrics, EMPTY_SNAPSHOT } from "@/features/snapshot/metrics";
import type { JobStatus } from "@/generated/api";

type SnapshotJob = {
  status: JobStatus;
};

type UseSnapshotViewModelParams = {
  workspaceId: string;
  jobs: SnapshotJob[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

export const useSnapshotViewModel = ({ workspaceId, jobs, isLoading, isError }: UseSnapshotViewModelParams) => {
  const snapshot = useMemo<SnapshotMetrics>(() => {
    if (!workspaceId) return EMPTY_SNAPSHOT;

    return buildSnapshotMetrics(jobs ?? []);
  }, [workspaceId, jobs]);

  const viewState: SnapshotViewState = !workspaceId ? "ready" : isLoading ? "loading" : isError ? "error" : "ready";

  return {
    snapshot,
    viewState,
  };
};
