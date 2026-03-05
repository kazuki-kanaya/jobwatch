import { useQueryClient } from "@tanstack/react-query";
import { dashboardQueryKeys } from "@/features/dashboard/api/queryKeys";
import type { MembershipRole } from "@/generated/api";
import {
  useCreateInvitationWorkspacesWorkspaceIdInvitationsPost,
  useRevokeInvitationWorkspacesWorkspaceIdInvitationsInvitationIdDelete,
} from "@/generated/api";
import { getAuthorizedRequestOptions } from "@/lib/api";

type UseInvitationMutationsParams = {
  accessToken: string | undefined;
  workspaceId: string;
};

export const useInvitationMutations = ({ accessToken, workspaceId }: UseInvitationMutationsParams) => {
  const queryClient = useQueryClient();
  const request = getAuthorizedRequestOptions(accessToken);
  const createMutation = useCreateInvitationWorkspacesWorkspaceIdInvitationsPost({ request });
  const revokeMutation = useRevokeInvitationWorkspacesWorkspaceIdInvitationsInvitationIdDelete({ request });

  const invalidateInvitationQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.invitations(workspaceId) });
  };

  const createInvitation = async (role: MembershipRole) => {
    if (!workspaceId) throw new Error("Workspace is not selected");

    const response = await createMutation.mutateAsync({
      workspaceId,
      data: { role },
    });
    await invalidateInvitationQueries();
    return response;
  };

  const revokeInvitation = async (invitationId: string) => {
    if (!workspaceId) throw new Error("Workspace is not selected");

    await revokeMutation.mutateAsync({
      workspaceId,
      invitationId,
    });

    await invalidateInvitationQueries();
  };

  return {
    createInvitation,
    revokeInvitation,
    isCreatingInvitation: createMutation.isPending,
    isRevokingInvitation: revokeMutation.isPending,
  };
};
