import { useEffect } from "react";

type WorkspaceItem = {
  id: string;
};

type UseWorkspaceAutoSelectParams = {
  workspaceId: string;
  workspaces: WorkspaceItem[];
  onWorkspaceIdChange: (workspaceId: string) => void;
};

export const useWorkspaceAutoSelect = ({
  workspaceId,
  workspaces,
  onWorkspaceIdChange,
}: UseWorkspaceAutoSelectParams) => {
  useEffect(() => {
    if (!workspaceId && workspaces.length > 0) {
      onWorkspaceIdChange(workspaces[0].id);
    }
  }, [onWorkspaceIdChange, workspaceId, workspaces]);
};
