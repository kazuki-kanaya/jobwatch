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

const getAuthorizedRequestOptions = (accessToken: string | undefined) => {
  if (!accessToken) return undefined;

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const useDashboardWorkspaceMutations = ({ accessToken }: UseDashboardWorkspaceMutationsParams) => {
  const queryClient = useQueryClient();
  const request = getAuthorizedRequestOptions(accessToken);

  const createMutation = useCreateWorkspaceWorkspacesPost({ request });
  const updateMutation = useUpdateWorkspaceWorkspacesWorkspaceIdPatch({ request });
  const deleteMutation = useDeleteWorkspaceWorkspacesWorkspaceIdDelete({ request });
  const transferOwnerMutation = useTransferOwnerWorkspacesWorkspaceIdOwnerPost({ request });

  const invalidateDashboardQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.root });
  };

  const createWorkspace = async (name: string) => {
    const response = await createMutation.mutateAsync({ data: { name } });
    await invalidateDashboardQueries();
    return response;
  };

  const updateWorkspace = async (workspaceId: string, name: string) => {
    const response = await updateMutation.mutateAsync({ workspaceId, data: { name } });
    await invalidateDashboardQueries();
    return response;
  };

  const deleteWorkspace = async (workspaceId: string) => {
    await deleteMutation.mutateAsync({ workspaceId });
    await invalidateDashboardQueries();
  };

  const transferOwner = async (workspaceId: string, newOwnerUserId: string) => {
    const response = await transferOwnerMutation.mutateAsync({
      workspaceId,
      data: { new_owner_user_id: newOwnerUserId },
    });
    await invalidateDashboardQueries();
    return response;
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
