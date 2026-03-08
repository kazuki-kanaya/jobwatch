import { useListJobsByWorkspaceWorkspacesWorkspaceIdJobsGet } from "@/generated/api";
import { getAuthorizedRequestOptions } from "@/lib/api";
import { snapshotQueryKeys } from "./snapshotQueryKeys";

type UseSnapshotQueriesParams = {
  accessToken: string | undefined;
  enabled: boolean;
  workspaceId: string;
};

export const useSnapshotQueries = ({ accessToken, enabled, workspaceId }: UseSnapshotQueriesParams) => {
  const request = getAuthorizedRequestOptions(accessToken);

  // TODO: Move this jobs query to features/job when the job feature is introduced.
  const jobsQuery = useListJobsByWorkspaceWorkspacesWorkspaceIdJobsGet(workspaceId, {
    query: {
      queryKey: snapshotQueryKeys.byWorkspace(workspaceId),
      enabled: enabled && Boolean(workspaceId),
    },
    request,
  });

  return {
    jobsQuery,
  };
};
