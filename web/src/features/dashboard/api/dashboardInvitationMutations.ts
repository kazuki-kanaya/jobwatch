// Responsibility: Provide invitation create/revoke mutations with dashboard-scoped cache invalidation.
import { useQueryClient } from "@tanstack/react-query";
import { dashboardQueryKeys } from "@/features/dashboard/api/queryKeys";
import {
  useCreateInvitationWorkspacesWorkspaceIdInvitationsPost,
  useRevokeInvitationWorkspacesWorkspaceIdInvitationsInvitationIdDelete,
} from "@/generated/api";
import type { MembershipRole } from "@/generated/models/index.zod";

type UseDashboardInvitationMutationsParams = {
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

export const useDashboardInvitationMutations = ({
  accessToken,
  workspaceId,
}: UseDashboardInvitationMutationsParams) => {
  const queryClient = useQueryClient();
  const fetch = getAuthorizedFetchOptions(accessToken);
  const createMutation = useCreateInvitationWorkspacesWorkspaceIdInvitationsPost({ fetch });
  const revokeMutation = useRevokeInvitationWorkspacesWorkspaceIdInvitationsInvitationIdDelete({ fetch });

  const invalidateInvitationQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.invitations(workspaceId) });
  };

  const createInvitation = async (role: MembershipRole) => {
    if (!workspaceId) throw new Error("Workspace is not selected");

    const response = await createMutation.mutateAsync({
      workspaceId,
      data: { role },
    });

    if (response.status !== 201) {
      throw new Error("Failed to create invitation");
    }

    await invalidateInvitationQueries();

    return response.data;
  };

  const revokeInvitation = async (invitationId: string) => {
    if (!workspaceId) throw new Error("Workspace is not selected");

    const response = await revokeMutation.mutateAsync({
      workspaceId,
      invitationId,
    });

    await invalidateInvitationQueries();
    if (response.status !== 204) throw new Error("Failed to revoke invitation");
  };

  return {
    createInvitation,
    revokeInvitation,
    isCreatingInvitation: createMutation.isPending,
    isRevokingInvitation: revokeMutation.isPending,
  };
};
