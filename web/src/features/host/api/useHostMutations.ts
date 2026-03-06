import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateHostWorkspacesWorkspaceIdHostsPost,
  useDeleteHostWorkspacesWorkspaceIdHostsHostIdDelete,
  useUpdateHostWorkspacesWorkspaceIdHostsHostIdPatch,
} from "@/generated/api";
import { getAuthorizedRequestOptions } from "@/lib/api";
import { hostQueryKeys } from "./hostQueryKeys";

type UseHostMutationsParams = {
  accessToken: string | undefined;
  workspaceId: string;
};

export const useHostMutations = ({ accessToken, workspaceId }: UseHostMutationsParams) => {
  const queryClient = useQueryClient();
  const request = getAuthorizedRequestOptions(accessToken);
  const createMutation = useCreateHostWorkspacesWorkspaceIdHostsPost({ request });
  const updateMutation = useUpdateHostWorkspacesWorkspaceIdHostsHostIdPatch({ request });
  const deleteMutation = useDeleteHostWorkspacesWorkspaceIdHostsHostIdDelete({ request });

  const invalidateHostQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: hostQueryKeys.root });
  };

  const createHost = async (name: string) => {
    if (!workspaceId) throw new Error("Workspace is not selected");

    const response = await createMutation.mutateAsync({
      workspaceId,
      data: { name },
    });
    await invalidateHostQueries();
    return response;
  };

  const updateHost = async (hostId: string, name: string) => {
    if (!workspaceId) throw new Error("Workspace is not selected");

    const response = await updateMutation.mutateAsync({
      workspaceId,
      hostId,
      data: { name },
    });
    await invalidateHostQueries();
    return response;
  };

  const deleteHost = async (hostId: string) => {
    if (!workspaceId) throw new Error("Workspace is not selected");

    await deleteMutation.mutateAsync({
      workspaceId,
      hostId,
    });
    await invalidateHostQueries();
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
