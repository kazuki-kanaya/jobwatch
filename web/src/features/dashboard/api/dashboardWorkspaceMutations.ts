// Responsibility: Provide workspace CRUD and ownership transfer mutations with dashboard cache invalidation.
import { useQueryClient } from "@tanstack/react-query";
import { dashboardQueryKeys } from "@/features/dashboard/api/queryKeys";
import {
  useCreateWorkspaceWorkspacesPost,
  useDeleteWorkspaceWorkspacesWorkspaceIdDelete,
  useTransferOwnerWorkspacesWorkspaceIdOwnerPost,
  useUpdateWorkspaceWorkspacesWorkspaceIdPatch,
} from "@/generated/api";

type UseDashboardWorkspaceMutationsParams = {
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

export const useDashboardWorkspaceMutations = ({ accessToken }: UseDashboardWorkspaceMutationsParams) => {
  const queryClient = useQueryClient();
  const fetch = getAuthorizedFetchOptions(accessToken);

  const createMutation = useCreateWorkspaceWorkspacesPost({ fetch });
  const updateMutation = useUpdateWorkspaceWorkspacesWorkspaceIdPatch({ fetch });
  const deleteMutation = useDeleteWorkspaceWorkspacesWorkspaceIdDelete({ fetch });
  const transferOwnerMutation = useTransferOwnerWorkspacesWorkspaceIdOwnerPost({ fetch });

  const invalidateDashboardQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.root });
  };

  const createWorkspace = async (name: string) => {
    const response = await createMutation.mutateAsync({ data: { name } });
    await invalidateDashboardQueries();
    if (response.status !== 201) throw new Error("Failed to create workspace");

    return response.data;
  };

  const updateWorkspace = async (workspaceId: string, name: string) => {
    const response = await updateMutation.mutateAsync({ workspaceId, data: { name } });
    await invalidateDashboardQueries();
    if (response.status !== 200) throw new Error("Failed to update workspace");

    return response.data;
  };

  const deleteWorkspace = async (workspaceId: string) => {
    const response = await deleteMutation.mutateAsync({ workspaceId });
    await invalidateDashboardQueries();
    if (response.status !== 204) throw new Error("Failed to delete workspace");
  };

  const transferOwner = async (workspaceId: string, newOwnerUserId: string) => {
    const response = await transferOwnerMutation.mutateAsync({
      workspaceId,
      data: { new_owner_user_id: newOwnerUserId },
    });
    await invalidateDashboardQueries();
    if (response.status !== 200) throw new Error("Failed to transfer owner");

    return response.data;
  };

  return {
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    transferOwner,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isTransferringOwner: transferOwnerMutation.isPending,
  };
};
