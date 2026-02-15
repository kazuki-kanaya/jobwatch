// Responsibility: Provide host CRUD mutations with dashboard-scoped cache invalidation.
import { useQueryClient } from "@tanstack/react-query";
import { dashboardQueryKeys } from "@/features/dashboard/api/queryKeys";
import {
  useCreateHostWorkspacesWorkspaceIdHostsPost,
  useDeleteHostWorkspacesWorkspaceIdHostsHostIdDelete,
  useUpdateHostWorkspacesWorkspaceIdHostsHostIdPatch,
} from "@/generated/api";

type UseDashboardHostMutationsParams = {
  accessToken: string | undefined;
  workspaceId: string;
};

const getAuthorizedFetchOptions = (accessToken: string | undefined) => {
  if (!accessToken) return undefined;

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  } satisfies RequestInit;
};

export const useDashboardHostMutations = ({ accessToken, workspaceId }: UseDashboardHostMutationsParams) => {
  const queryClient = useQueryClient();
  const fetch = getAuthorizedFetchOptions(accessToken);

  const invalidateHostRelatedQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.hosts(workspaceId) });
    await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.jobs(workspaceId) });
  };

  const createMutation = useCreateHostWorkspacesWorkspaceIdHostsPost({ fetch });
  const updateMutation = useUpdateHostWorkspacesWorkspaceIdHostsHostIdPatch({ fetch });
  const deleteMutation = useDeleteHostWorkspacesWorkspaceIdHostsHostIdDelete({ fetch });

  const createHost = async (name: string) => {
    if (!workspaceId) throw new Error("Workspace is not selected");
    const response = await createMutation.mutateAsync({
      workspaceId,
      data: { name },
    });
    await invalidateHostRelatedQueries();

    if (response.status !== 201) {
      throw new Error("Failed to create host");
    }

    return response.data;
  };

  const updateHost = async (hostId: string, name: string) => {
    if (!workspaceId) throw new Error("Workspace is not selected");
    const response = await updateMutation.mutateAsync({
      workspaceId,
      hostId,
      data: { name },
    });
    await invalidateHostRelatedQueries();

    if (response.status !== 200) {
      throw new Error("Failed to update host");
    }

    return response.data;
  };

  const deleteHost = async (hostId: string) => {
    if (!workspaceId) throw new Error("Workspace is not selected");
    const response = await deleteMutation.mutateAsync({ workspaceId, hostId });
    await invalidateHostRelatedQueries();

    if (response.status !== 204) {
      throw new Error("Failed to delete host");
    }
  };

  return {
    createHost,
    updateHost,
    deleteHost,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
