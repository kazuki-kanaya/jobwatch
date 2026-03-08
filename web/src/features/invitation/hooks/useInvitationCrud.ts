import { useState } from "react";
import { toast } from "sonner";
import { useInvitationMutations } from "@/features/invitation/api/useInvitationMutations";
import type { MembershipRole } from "@/generated/api";

type UseInvitationCrudTexts = {
  invitationLinkCreated: string;
  invitationLinkCopied: string;
  invitationCrudError: string;
  invitationRevoked: string;
};

type UseInvitationCrudParams = {
  accessToken: string | undefined;
  workspaceId: string;
  texts: UseInvitationCrudTexts;
};

export const useInvitationCrud = ({ accessToken, workspaceId, texts }: UseInvitationCrudParams) => {
  const invitationMutations = useInvitationMutations({ accessToken, workspaceId });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [draftRole, setDraftRole] = useState<MembershipRole>("viewer");
  const [createdInvitationUrl, setCreatedInvitationUrl] = useState<string | null>(null);
  const [pendingRevokeInvitationId, setPendingRevokeInvitationId] = useState<string | null>(null);

  const isSubmitting = invitationMutations.isCreating || invitationMutations.isRevoking;

  const openCreateDialog = () => setIsCreateDialogOpen(true);

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false);
    setDraftRole("viewer");
    setCreatedInvitationUrl(null);
  };

  const requestRevoke = (invitationId: string) => setPendingRevokeInvitationId(invitationId);

  const cancelRevoke = () => setPendingRevokeInvitationId(null);

  const submitCreateInvitation = async () => {
    try {
      const response = await invitationMutations.createInvitation(draftRole);
      const invitationUrl = `${window.location.origin}/invite?token=${encodeURIComponent(response.token)}`;
      setCreatedInvitationUrl(invitationUrl);
      toast.success(texts.invitationLinkCreated);
    } catch (error) {
      console.error(error);
      toast.error(texts.invitationCrudError);
    }
  };

  const copyCreatedInvitationUrl = async () => {
    if (!createdInvitationUrl) return;

    try {
      await navigator.clipboard.writeText(createdInvitationUrl);
      toast.success(texts.invitationLinkCopied);
    } catch (error) {
      console.error(error);
      toast.error(texts.invitationCrudError);
    }
  };

  const confirmRevoke = async () => {
    if (!pendingRevokeInvitationId) return;

    try {
      await invitationMutations.revokeInvitation(pendingRevokeInvitationId);
      toast.success(texts.invitationRevoked);
    } catch (error) {
      console.error(error);
      toast.error(texts.invitationCrudError);
    } finally {
      setPendingRevokeInvitationId(null);
    }
  };

  return {
    draftRole,
    createdInvitationUrl,
    pendingRevokeInvitationId,
    isCreateDialogOpen,
    isSubmitting,
    setDraftRole,
    openCreateDialog,
    closeCreateDialog,
    requestRevoke,
    cancelRevoke,
    submitCreateInvitation,
    copyCreatedInvitationUrl,
    confirmRevoke,
  };
};
