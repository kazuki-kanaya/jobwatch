import {
  type SearchJobsByWorkspaceWorkspacesWorkspaceIdJobsSearchGetParams,
  useListJobsByWorkspaceWorkspacesWorkspaceIdJobsGet,
  useSearchJobsByWorkspaceWorkspacesWorkspaceIdJobsSearchGet,
} from "@/generated/api";
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

type UseJobSearchQueryParams = UseJobQueriesParams & {
  params: SearchJobsByWorkspaceWorkspacesWorkspaceIdJobsSearchGetParams;
};

export const useJobSearchQuery = ({ accessToken, enabled, workspaceId, params }: UseJobSearchQueryParams) => {
  const request = getAuthorizedRequestOptions(accessToken);

  const jobsQuery = useSearchJobsByWorkspaceWorkspacesWorkspaceIdJobsSearchGet(workspaceId, params, {
    query: {
      queryKey: jobQueryKeys.search(workspaceId, params),
      enabled: enabled && Boolean(workspaceId),
      placeholderData: (previousData) => previousData,
    },
    request,
  });

  return {
    jobsQuery,
  };
};
