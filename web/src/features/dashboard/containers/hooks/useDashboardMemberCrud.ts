// Responsibility: Manage member add/remove and invitation URL state transitions with toast feedback.
import { useState } from "react";
import { toast } from "sonner";
import { useDashboardInvitationMutations } from "@/features/dashboard/api/dashboardInvitationMutations";
import { useDashboardMemberMutations } from "@/features/dashboard/api/dashboardMemberMutations";
import type { DashboardViewModel } from "@/features/dashboard/types";
import type { MembershipRole } from "@/generated/models/index.zod";

type UseDashboardMemberCrudParams = {
  accessToken: string | undefined;
  workspaceId: string;
  texts: Pick<
    DashboardViewModel["texts"],
    | "memberAdded"
    | "memberUpdated"
    | "memberRemoved"
    | "memberCrudError"
    | "invitationLinkCreated"
    | "invitationLinkCreateError"
    | "invitationLinkCopied"
  >;
};

type UseDashboardMemberCrudResult = {
  draftUserId: string;
  draftRole: MembershipRole;
  inviteRole: MembershipRole;
  editingUserId: string | null;
  editingRole: MembershipRole;
  invitationUrl: string | null;
  pendingDeleteUserId: string | null;
  isAddDialogOpen: boolean;
  isInviteDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isMemberSubmitting: boolean;
  setDraftUserId: (value: string) => void;
  setDraftRole: (value: MembershipRole) => void;
  setInviteRole: (value: MembershipRole) => void;
  setEditingRole: (value: MembershipRole) => void;
  openAddDialog: () => void;
  closeAddDialog: () => void;
  openInviteDialog: () => void;
  closeInviteDialog: () => void;
  openEditDialog: (userId: string, role: MembershipRole) => void;
  closeEditDialog: () => void;
  submitAddMember: () => Promise<void>;
  createInvitationUrl: () => Promise<void>;
  copyInvitationLink: () => Promise<void>;
  submitUpdateMemberRole: () => Promise<void>;
  requestRemoveMember: (userId: string) => void;
  cancelRemoveMember: () => void;
  confirmRemoveMember: () => Promise<void>;
};

export const useDashboardMemberCrud = ({
  accessToken,
  workspaceId,
  texts,
}: UseDashboardMemberCrudParams): UseDashboardMemberCrudResult => {
  const [draftUserId, setDraftUserId] = useState("");
  const [draftRole, setDraftRole] = useState<MembershipRole>("viewer");
  const [inviteRole, setInviteRole] = useState<MembershipRole>("viewer");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<MembershipRole>("viewer");
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null);
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const memberMutations = useDashboardMemberMutations({ accessToken, workspaceId });
  const invitationMutations = useDashboardInvitationMutations({ accessToken, workspaceId });

  return {
    draftUserId,
    draftRole,
    inviteRole,
    editingUserId,
    editingRole,
    invitationUrl,
    pendingDeleteUserId,
    isAddDialogOpen,
    isInviteDialogOpen,
    isEditDialogOpen,
    isMemberSubmitting:
      memberMutations.isAdding ||
      memberMutations.isUpdating ||
      memberMutations.isRemoving ||
      invitationMutations.isCreatingInvitation,
    setDraftUserId,
    setDraftRole,
    setInviteRole,
    setEditingRole,
    openAddDialog: () => {
      setDraftUserId("");
      setDraftRole("viewer");
      setIsAddDialogOpen(true);
    },
    closeAddDialog: () => setIsAddDialogOpen(false),
    openInviteDialog: () => {
      setInviteRole("viewer");
      setInvitationUrl(null);
      setIsInviteDialogOpen(true);
    },
    closeInviteDialog: () => {
      setIsInviteDialogOpen(false);
      setInvitationUrl(null);
    },
    openEditDialog: (userId, role) => {
      setEditingUserId(userId);
      setEditingRole(role);
      setIsEditDialogOpen(true);
    },
    closeEditDialog: () => {
      setIsEditDialogOpen(false);
      setEditingUserId(null);
      setEditingRole("viewer");
    },
    submitAddMember: async () => {
      const userId = draftUserId.trim();
      if (!userId) return;

      try {
        await memberMutations.addMember(userId, draftRole);
        toast.success(texts.memberAdded);
        setIsAddDialogOpen(false);
        setDraftUserId("");
      } catch (error) {
        console.error(error);
        toast.error(texts.memberCrudError);
      }
    },
    createInvitationUrl: async () => {
      try {
        const response = await invitationMutations.createInvitation(inviteRole);
        const link = `${window.location.origin}/invite?token=${encodeURIComponent(response.token)}`;
        setInvitationUrl(link);
        toast.success(texts.invitationLinkCreated);
      } catch (error) {
        console.error(error);
        toast.error(texts.invitationLinkCreateError);
      }
    },
    copyInvitationLink: async () => {
      if (!invitationUrl) return;

      try {
        await navigator.clipboard.writeText(invitationUrl);
        toast.success(texts.invitationLinkCopied);
      } catch (error) {
        console.error(error);
        toast.error(texts.invitationLinkCreateError);
      }
    },
    submitUpdateMemberRole: async () => {
      if (!editingUserId) return;
      try {
        await memberMutations.updateMemberRole(editingUserId, editingRole);
        toast.success(texts.memberUpdated);
        setIsEditDialogOpen(false);
        setEditingUserId(null);
      } catch (error) {
        console.error(error);
        toast.error(texts.memberCrudError);
      }
    },
    requestRemoveMember: (userId) => setPendingDeleteUserId(userId),
    cancelRemoveMember: () => setPendingDeleteUserId(null),
    confirmRemoveMember: async () => {
      if (!pendingDeleteUserId) return;
      try {
        await memberMutations.removeMember(pendingDeleteUserId);
        toast.success(texts.memberRemoved);
      } catch (error) {
        console.error(error);
        toast.error(texts.memberCrudError);
      } finally {
        setPendingDeleteUserId(null);
      }
    },
  };
};
