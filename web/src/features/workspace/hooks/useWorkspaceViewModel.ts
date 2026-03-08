import { useMemo } from "react";
import type { WorkspaceViewState } from "@/features/workspace/components/types";
import type { WorkspaceMemberResponse } from "@/generated/api";

type WorkspaceSummaryItem = {
  workspace_id: string;
  name: string;
};

type LookupUser = {
  user_id: string;
  name: string;
};

type UseWorkspaceViewModelParams = {
  workspaceId: string;
  workspaces: WorkspaceSummaryItem[] | undefined;
  members: WorkspaceMemberResponse[] | undefined;
  users: LookupUser[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

export const useWorkspaceViewModel = ({
  workspaceId,
  workspaces: workspaceItems,
  members,
  users,
  isLoading,
  isError,
}: UseWorkspaceViewModelParams) => {
  const workspaces = useMemo(() => {
    const items = workspaceItems ?? [];
    return items.map((workspace) => ({
      id: workspace.workspace_id,
      name: workspace.name,
    }));
  }, [workspaceItems]);

  const activeWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === workspaceId) ?? workspaces[0],
    [workspaceId, workspaces],
  );

  const activeWorkspaceId = activeWorkspace?.id ?? "";
  const selectedWorkspaceName = activeWorkspace?.name ?? "-";

  const userNameById = useMemo(() => {
    const userItems = users ?? [];
    return userItems.reduce<Record<string, string>>((acc, user) => {
      acc[user.user_id] = user.name;
      return acc;
    }, {});
  }, [users]);

  const ownerOptions = useMemo(() => {
    const memberItems = members ?? [];
    return memberItems.map((member) => ({
      id: member.user_id,
      name: userNameById[member.user_id] ? `${userNameById[member.user_id]} (${member.user_id})` : member.user_id,
    }));
  }, [members, userNameById]);

  const viewState: WorkspaceViewState = isLoading
    ? "loading"
    : isError
      ? "error"
      : workspaces.length === 0
        ? "empty"
        : "ready";

  return {
    workspaces,
    activeWorkspaceId,
    selectedWorkspaceName,
    ownerOptions,
    viewState,
  };
};
