import { useQueryClient } from "@tanstack/react-query";
import { dashboardQueryKeys } from "@/features/dashboard/api/queryKeys";
import type { MembershipRole } from "@/generated/api";
import {
  useAddMemberWorkspacesWorkspaceIdMembersUserIdPut,
  useRemoveMemberWorkspacesWorkspaceIdMembersUserIdDelete,
  useUpdateMemberRoleWorkspacesWorkspaceIdMembersUserIdPatch,
} from "@/generated/api";

type UseDashboardMemberMutationsParams = {
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

export const useDashboardMemberMutations = ({ accessToken, workspaceId }: UseDashboardMemberMutationsParams) => {
  const queryClient = useQueryClient();
  const request = getAuthorizedRequestOptions(accessToken);

  const addMutation = useAddMemberWorkspacesWorkspaceIdMembersUserIdPut({ request });
  const updateMutation = useUpdateMemberRoleWorkspacesWorkspaceIdMembersUserIdPatch({ request });
  const removeMutation = useRemoveMemberWorkspacesWorkspaceIdMembersUserIdDelete({ request });

  const invalidateMemberQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.members(workspaceId) });
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

  const removeMember = async (userId: string) => {
    if (!workspaceId) throw new Error("Workspace is not selected");

    await removeMutation.mutateAsync({ workspaceId, userId });

    await invalidateMemberQueries();
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

  return {
    addMember,
    updateMemberRole,
    removeMember,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
};
