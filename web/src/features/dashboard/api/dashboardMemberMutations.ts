// Responsibility: Provide member CRUD mutations with dashboard-scoped cache invalidation.
import { useQueryClient } from "@tanstack/react-query";
import { dashboardQueryKeys } from "@/features/dashboard/api/queryKeys";
import {
  useAddMemberWorkspacesWorkspaceIdMembersUserIdPut,
  useRemoveMemberWorkspacesWorkspaceIdMembersUserIdDelete,
  useUpdateMemberRoleWorkspacesWorkspaceIdMembersUserIdPatch,
} from "@/generated/api";
import type { MembershipRole } from "@/generated/models/index.zod";

type UseDashboardMemberMutationsParams = {
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

export const useDashboardMemberMutations = ({ accessToken, workspaceId }: UseDashboardMemberMutationsParams) => {
  const queryClient = useQueryClient();
  const fetch = getAuthorizedFetchOptions(accessToken);

  const addMutation = useAddMemberWorkspacesWorkspaceIdMembersUserIdPut({ fetch });
  const updateMutation = useUpdateMemberRoleWorkspacesWorkspaceIdMembersUserIdPatch({ fetch });
  const removeMutation = useRemoveMemberWorkspacesWorkspaceIdMembersUserIdDelete({ fetch });

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
    if (response.status !== 200) throw new Error("Failed to add member");

    return response.data;
  };

  const removeMember = async (userId: string) => {
    if (!workspaceId) throw new Error("Workspace is not selected");

    const response = await removeMutation.mutateAsync({ workspaceId, userId });

    await invalidateMemberQueries();
    if (response.status !== 204) throw new Error("Failed to remove member");
  };

  const updateMemberRole = async (userId: string, role: MembershipRole) => {
    if (!workspaceId) throw new Error("Workspace is not selected");

    const response = await updateMutation.mutateAsync({
      workspaceId,
      userId,
      data: { role },
    });

    await invalidateMemberQueries();
    if (response.status !== 200) throw new Error("Failed to update member role");

    return response.data;
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
