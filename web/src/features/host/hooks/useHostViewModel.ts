import { useMemo } from "react";
import type { HostViewState } from "@/features/host/components/types";
import type { SnapshotMetrics, SnapshotViewState } from "@/features/snapshot";
import { buildSnapshotMetrics, EMPTY_SNAPSHOT } from "@/features/snapshot";
import type { JobStatus } from "@/generated/api";

type HostSummaryItem = {
  host_id: string;
  name: string;
};

type WorkspaceSummaryItem = {
  workspace_id: string;
  name: string;
};

type SnapshotJob = {
  host_id: string;
  status: JobStatus;
};

type UseHostViewModelParams = {
  workspaceId: string;
  hosts: HostSummaryItem[] | undefined;
  jobs: SnapshotJob[] | undefined;
  workspaces: WorkspaceSummaryItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  isSnapshotLoading: boolean;
  isSnapshotError: boolean;
};

export const useHostViewModel = ({
  workspaceId,
  hosts: hostItems,
  jobs: jobItems,
  workspaces: workspaceItems,
  isLoading,
  isError,
  isSnapshotLoading,
  isSnapshotError,
}: UseHostViewModelParams) => {
  const snapshotState: SnapshotViewState = isSnapshotLoading ? "loading" : isSnapshotError ? "error" : "ready";
  const snapshotByHostId = useMemo(() => {
    if (!workspaceId) return new Map<string, SnapshotMetrics>();

    const buckets = new Map<string, SnapshotJob[]>();
    for (const job of jobItems ?? []) {
      const current = buckets.get(job.host_id);
      if (current) {
        current.push(job);
        continue;
      }
      buckets.set(job.host_id, [job]);
    }

    return new Map(Array.from(buckets.entries()).map(([hostId, jobs]) => [hostId, buildSnapshotMetrics(jobs)]));
  }, [jobItems, workspaceId]);

  const hosts = useMemo(() => {
    const items = hostItems ?? [];
    return items.map((host) => ({
      id: host.host_id,
      name: host.name,
      snapshot: snapshotByHostId.get(host.host_id) ?? EMPTY_SNAPSHOT,
      snapshotState,
    }));
  }, [hostItems, snapshotByHostId, snapshotState]);

  const workspaceName = useMemo(() => {
    const workspaces = workspaceItems ?? [];
    return workspaces.find((workspace) => workspace.workspace_id === workspaceId)?.name ?? "";
  }, [workspaceId, workspaceItems]);

  const viewState: HostViewState = isLoading ? "loading" : isError ? "error" : hosts.length === 0 ? "empty" : "ready";

  return {
    hosts,
    workspaceName,
    viewState,
  };
};
