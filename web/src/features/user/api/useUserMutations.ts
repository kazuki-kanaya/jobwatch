import { useQueryClient } from "@tanstack/react-query";
import { useUpdateCurrentUserUsersMePatch } from "@/generated/api";
import { getAuthorizedRequestOptions } from "@/lib/api";
import { userQueryKeys } from "./userQueryKeys";

type UseUserMutationsParams = {
  accessToken: string | undefined;
};

export const useUserMutations = ({ accessToken }: UseUserMutationsParams) => {
  const queryClient = useQueryClient();
  const request = getAuthorizedRequestOptions(accessToken);
  const updateCurrentUserMutation = useUpdateCurrentUserUsersMePatch({ request });

  const updateCurrentUserName = async (name: string) => {
    const response = await updateCurrentUserMutation.mutateAsync({ data: { name } });
    await queryClient.invalidateQueries({ queryKey: userQueryKeys.current() });
    return response;
  };

  return {
    updateCurrentUserName,
    isUpdatingCurrentUser: updateCurrentUserMutation.isPending,
  };
};
