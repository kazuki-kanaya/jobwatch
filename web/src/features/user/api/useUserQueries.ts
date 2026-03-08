import { useReadCurrentUserUsersMeGet } from "@/generated/api";
import { getAuthorizedRequestOptions } from "@/lib/api";
import { userQueryKeys } from "./userQueryKeys";

type UseUserQueriesParams = {
  accessToken: string | undefined;
  enabled: boolean;
};

export const useUserQueries = ({ accessToken, enabled }: UseUserQueriesParams) => {
  const request = getAuthorizedRequestOptions(accessToken);
  const currentUserQuery = useReadCurrentUserUsersMeGet({
    query: {
      queryKey: userQueryKeys.current(),
      enabled,
    },
    request,
  });

  return {
    currentUserQuery,
  };
};
