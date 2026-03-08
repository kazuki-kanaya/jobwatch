import { useListJobsByWorkspaceWorkspacesWorkspaceIdJobsGet } from "@/generated/api";
import { getAuthorizedRequestOptions } from "@/lib/api";
import { jobQueryKeys } from "./jobQueryKeys";

type UseJobQueriesParams = {
  accessToken: string | undefined;
  enabled: boolean;
  workspaceId: string;
};

export const useJobQueries = ({ accessToken, enabled, workspaceId }: UseJobQueriesParams) => {
  const request = getAuthorizedRequestOptions(accessToken);

  const jobsQuery = useListJobsByWorkspaceWorkspacesWorkspaceIdJobsGet(workspaceId, {
    query: {
      queryKey: jobQueryKeys.byWorkspace(workspaceId),
      enabled: enabled && Boolean(workspaceId),
    },
    request,
  });

  return {
    jobsQuery,
  };
};
