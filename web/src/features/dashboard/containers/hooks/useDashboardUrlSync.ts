// Responsibility: Keep dashboard filter state synchronized with URL search parameters.
import { useEffect } from "react";
import type { SetURLSearchParams } from "react-router";
import { ALL_FILTER_ID } from "@/features/dashboard/containers/hooks/constants";

type UseDashboardUrlSyncParams = {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  activeWorkspaceId: string;
  selectedHostId: string;
  appliedQuery: string;
};

export const useDashboardUrlSync = ({
  searchParams,
  setSearchParams,
  activeWorkspaceId,
  selectedHostId,
  appliedQuery,
}: UseDashboardUrlSyncParams) => {
  useEffect(() => {
    const nextSearchParams = new URLSearchParams(searchParams);
    if (activeWorkspaceId) nextSearchParams.set("workspace", activeWorkspaceId);
    else nextSearchParams.delete("workspace");

    if (selectedHostId && selectedHostId !== ALL_FILTER_ID) nextSearchParams.set("host", selectedHostId);
    else nextSearchParams.delete("host");

    if (appliedQuery.trim()) nextSearchParams.set("q", appliedQuery.trim());
    else nextSearchParams.delete("q");

    if (nextSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(nextSearchParams, { replace: true });
    }
  }, [activeWorkspaceId, appliedQuery, searchParams, selectedHostId, setSearchParams]);
};
