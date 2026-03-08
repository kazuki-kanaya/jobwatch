import { useQueryClient } from "@tanstack/react-query";
import type { MembershipRole } from "@/generated/api";
import {
  useAddMemberWorkspacesWorkspaceIdMembersUserIdPut,
  useRemoveMemberWorkspacesWorkspaceIdMembersUserIdDelete,
  useUpdateMemberRoleWorkspacesWorkspaceIdMembersUserIdPatch,
} from "@/generated/api";
import { getAuthorizedRequestOptions } from "@/lib/api";
import { memberQueryKeys } from "./memberQueryKeys";

type UseMemberMutationsParams = {
  accessToken: string | undefined;
  workspaceId: string;
};

export const useMemberMutations = ({ accessToken, workspaceId }: UseMemberMutationsParams) => {
  const queryClient = useQueryClient();
  const request = getAuthorizedRequestOptions(accessToken);
  const addMutation = useAddMemberWorkspacesWorkspaceIdMembersUserIdPut({ request });
  const updateMutation = useUpdateMemberRoleWorkspacesWorkspaceIdMembersUserIdPatch({ request });
  const removeMutation = useRemoveMemberWorkspacesWorkspaceIdMembersUserIdDelete({ request });

  const invalidateMemberQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: memberQueryKeys.list(workspaceId) });
  };

  const addMember = async (userId: string, role: MembershipRole) => {
    if (!workspaceId) throw new Error("Workspace is not selected");

    const response = await addMutation.mutateAsync({
      workspaceId,
      userId,
      data: { role },
    });

    await invalidateMemberQueries();
    return response;
  };

  const updateMemberRole = async (userId: string, role: MembershipRole) => {
    if (!workspaceId) throw new Error("Workspace is not selected");

    const response = await updateMutation.mutateAsync({
      workspaceId,
      userId,
      data: { role },
    });

    await invalidateMemberQueries();
    return response;
  };

  const removeMember = async (userId: string) => {
    if (!workspaceId) throw new Error("Workspace is not selected");

    await removeMutation.mutateAsync({ workspaceId, userId });
    await invalidateMemberQueries();
  };

  return {
    addMember,
    updateMemberRole,
    removeMember,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
};
