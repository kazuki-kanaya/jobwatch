import { useListHostsWorkspacesWorkspaceIdHostsGet } from "@/generated/api";
import { getAuthorizedRequestOptions } from "@/lib/api";
import { hostQueryKeys } from "./hostQueryKeys";

type UseHostQueriesParams = {
  accessToken: string | undefined;
  enabled: boolean;
  workspaceId: string;
};

export const useHostQueries = ({ accessToken, enabled, workspaceId }: UseHostQueriesParams) => {
  const request = getAuthorizedRequestOptions(accessToken);

  const hostsQuery = useListHostsWorkspacesWorkspaceIdHostsGet(workspaceId, {
    query: {
      queryKey: hostQueryKeys.list(workspaceId),
      enabled: enabled && Boolean(workspaceId),
    },
    request,
  });

  return {
    hostsQuery,
  };
};
