import { useQueryClient } from "@tanstack/react-query";
import { dashboardQueryKeys } from "@/features/dashboard/api/queryKeys";
import { useUpdateCurrentUserUsersMePatch } from "@/generated/api";

type UseDashboardUserMutationsParams = {
  accessToken: string | undefined;
};

const getAuthorizedRequestOptions = (accessToken: string | undefined) => {
  if (!accessToken) return undefined;

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const useDashboardUserMutations = ({ accessToken }: UseDashboardUserMutationsParams) => {
  const queryClient = useQueryClient();
  const request = getAuthorizedRequestOptions(accessToken);
  const updateMutation = useUpdateCurrentUserUsersMePatch({ request });

  const updateCurrentUserName = async (name: string) => {
    const response = await updateMutation.mutateAsync({ data: { name } });
    await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.currentUser() });
    await queryClient.invalidateQueries({ queryKey: ["dashboard", "users"] });
    return response;
  };

  return {
    updateCurrentUserName,
    isUpdating: updateMutation.isPending,
  };
};
