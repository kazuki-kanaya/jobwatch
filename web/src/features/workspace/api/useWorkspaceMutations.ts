import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateWorkspaceWorkspacesPost,
  useDeleteWorkspaceWorkspacesWorkspaceIdDelete,
  useTransferOwnerWorkspacesWorkspaceIdOwnerPost,
  useUpdateWorkspaceWorkspacesWorkspaceIdPatch,
} from "@/generated/api";
import { workspaceQueryKeys } from "./workspaceQueryKeys";

type UseWorkspaceMutationsParams = {
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

export const useWorkspaceMutations = ({ accessToken }: UseWorkspaceMutationsParams) => {
  const queryClient = useQueryClient();
  const request = getAuthorizedRequestOptions(accessToken);

  const createMutation = useCreateWorkspaceWorkspacesPost({ request });
  const updateMutation = useUpdateWorkspaceWorkspacesWorkspaceIdPatch({ request });
  const deleteMutation = useDeleteWorkspaceWorkspacesWorkspaceIdDelete({ request });
  const transferOwnerMutation = useTransferOwnerWorkspacesWorkspaceIdOwnerPost({ request });

  const invalidateWorkspaceQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: workspaceQueryKeys.root });
  };

  const createWorkspace = async (name: string) => {
    const response = await createMutation.mutateAsync({ data: { name } });
    await invalidateWorkspaceQueries();
    return response;
  };

  const updateWorkspace = async (workspaceId: string, name: string) => {
    const response = await updateMutation.mutateAsync({ workspaceId, data: { name } });
    await invalidateWorkspaceQueries();
    return response;
  };

  const deleteWorkspace = async (workspaceId: string) => {
    await deleteMutation.mutateAsync({ workspaceId });
    await invalidateWorkspaceQueries();
  };

  const transferOwner = async (workspaceId: string, newOwnerUserId: string) => {
    const response = await transferOwnerMutation.mutateAsync({
      workspaceId,
      data: { new_owner_user_id: newOwnerUserId },
    });
    await invalidateWorkspaceQueries();
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
