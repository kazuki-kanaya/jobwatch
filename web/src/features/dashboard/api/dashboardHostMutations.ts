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

const getAuthorizedRequestOptions = (accessToken: string | undefined) => {
  if (!accessToken) return undefined;

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const useDashboardHostMutations = ({ accessToken, workspaceId }: UseDashboardHostMutationsParams) => {
  const queryClient = useQueryClient();
  const request = getAuthorizedRequestOptions(accessToken);

  const invalidateHostRelatedQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.hosts(workspaceId) });
    await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.jobs(workspaceId) });
  };

  const createMutation = useCreateHostWorkspacesWorkspaceIdHostsPost({ request });
  const updateMutation = useUpdateHostWorkspacesWorkspaceIdHostsHostIdPatch({ request });
  const deleteMutation = useDeleteHostWorkspacesWorkspaceIdHostsHostIdDelete({ request });

  const createHost = async (name: string) => {
    if (!workspaceId) throw new Error("Workspace is not selected");
    const response = await createMutation.mutateAsync({
      workspaceId,
      data: { name },
    });
    await invalidateHostRelatedQueries();
    return response;
  };

  const updateHost = async (hostId: string, name: string) => {
    if (!workspaceId) throw new Error("Workspace is not selected");
    const response = await updateMutation.mutateAsync({
      workspaceId,
      hostId,
      data: { name },
    });
    await invalidateHostRelatedQueries();
    return response;
  };

  const deleteHost = async (hostId: string) => {
    if (!workspaceId) throw new Error("Workspace is not selected");
    await deleteMutation.mutateAsync({ workspaceId, hostId });
    await invalidateHostRelatedQueries();
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
