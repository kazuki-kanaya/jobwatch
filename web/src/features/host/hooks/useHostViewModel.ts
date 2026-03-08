import { useMemo } from "react";
import type { HostViewState } from "@/features/host/components/types";

type HostSummaryItem = {
  host_id: string;
  name: string;
};

type WorkspaceSummaryItem = {
  workspace_id: string;
  name: string;
};

type UseHostViewModelParams = {
  workspaceId: string;
  hosts: HostSummaryItem[] | undefined;
  workspaces: WorkspaceSummaryItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

export const useHostViewModel = ({
  workspaceId,
  hosts: hostItems,
  workspaces: workspaceItems,
  isLoading,
  isError,
}: UseHostViewModelParams) => {
  const hosts = useMemo(() => {
    const items = hostItems ?? [];
    return items.map((host) => ({
      id: host.host_id,
      name: host.name,
    }));
  }, [hostItems]);

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
