// Responsibility: Manage dashboard filter state and user interactions.
import { useState } from "react";
import { ALL_FILTER_ID } from "@/features/dashboard/containers/hooks/constants";

type UseDashboardFiltersParams = {
  initialWorkspaceId?: string;
  initialHostId?: string;
  initialQuery?: string;
};

type UseDashboardFiltersResult = {
  workspaceId: string;
  setWorkspaceId: (workspaceId: string) => void;
  hostId: string;
  setHostId: (hostId: string) => void;
  queryInput: string;
  setQueryInput: (query: string) => void;
  appliedQuery: string;
  applyFilters: () => void;
};

export const useDashboardFilters = ({
  initialWorkspaceId = "",
  initialHostId = ALL_FILTER_ID,
  initialQuery = "",
}: UseDashboardFiltersParams = {}): UseDashboardFiltersResult => {
  const [workspaceId, setWorkspaceIdState] = useState(initialWorkspaceId);
  const [hostId, setHostIdState] = useState(initialHostId || ALL_FILTER_ID);
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [appliedQuery, setAppliedQuery] = useState(initialQuery);

  return {
    workspaceId,
    setWorkspaceId: (nextWorkspaceId) => {
      setWorkspaceIdState(nextWorkspaceId);
      setHostIdState(ALL_FILTER_ID);
    },
    hostId,
    setHostId: setHostIdState,
    queryInput,
    setQueryInput,
    appliedQuery,
    applyFilters: () => setAppliedQuery(queryInput),
  };
};
