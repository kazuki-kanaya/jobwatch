// Responsibility: Provide current-user profile mutation with dashboard-scoped cache invalidation.
import { useQueryClient } from "@tanstack/react-query";
import { dashboardQueryKeys } from "@/features/dashboard/api/queryKeys";
import { useUpdateCurrentUserUsersMePatch } from "@/generated/api";

type UseDashboardUserMutationsParams = {
  accessToken: string | undefined;
};

const getAuthorizedFetchOptions = (accessToken: string | undefined) => {
  if (!accessToken) return undefined;

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  } satisfies RequestInit;
};

export const useDashboardUserMutations = ({ accessToken }: UseDashboardUserMutationsParams) => {
  const queryClient = useQueryClient();
  const fetch = getAuthorizedFetchOptions(accessToken);
  const updateMutation = useUpdateCurrentUserUsersMePatch({ fetch });

  const updateCurrentUserName = async (name: string) => {
    const response = await updateMutation.mutateAsync({ data: { name } });
    await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.currentUser() });
    await queryClient.invalidateQueries({ queryKey: ["dashboard", "users"] });

    if (response.status !== 200) {
      throw new Error("Failed to update current user");
    }

    return response.data;
  };

  return {
    updateCurrentUserName,
    isUpdating: updateMutation.isPending,
  };
};
