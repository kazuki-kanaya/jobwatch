import { useState } from "react";
import { toast } from "sonner";
import { useMemberMutations } from "@/features/member/api/useMemberMutations";
import type { MembershipRole } from "@/generated/api";

type UseMemberCrudTexts = {
  memberAdded: string;
  memberUpdated: string;
  memberRemoved: string;
  memberCrudError: string;
};

type UseMemberCrudParams = {
  accessToken: string | undefined;
  workspaceId: string;
  texts: UseMemberCrudTexts;
};

export const useMemberCrud = ({ accessToken, workspaceId, texts }: UseMemberCrudParams) => {
  const memberMutations = useMemberMutations({ accessToken, workspaceId });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [draftUserId, setDraftUserId] = useState("");
  const [draftRole, setDraftRole] = useState<MembershipRole>("viewer");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<MembershipRole>("viewer");
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState<string | null>(null);

  const isSubmitting = memberMutations.isAdding || memberMutations.isUpdating || memberMutations.isRemoving;

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    setDraftUserId("");
    setDraftRole("viewer");
  };

  const closeRoleDialog = () => {
    setIsRoleDialogOpen(false);
    setEditingUserId(null);
    setEditingRole("viewer");
  };

  const openAddDialog = () => setIsAddDialogOpen(true);

  const openRoleDialog = (userId: string, role: MembershipRole) => {
    setEditingUserId(userId);
    setEditingRole(role);
    setIsRoleDialogOpen(true);
  };

  const requestDelete = (userId: string) => setPendingDeleteUserId(userId);

  const cancelDelete = () => setPendingDeleteUserId(null);

  const submitAddMember = async () => {
    const userId = draftUserId.trim();
    if (!userId) return;

    try {
      await memberMutations.addMember(userId, draftRole);
      toast.success(texts.memberAdded);
      closeAddDialog();
    } catch (error) {
      console.error(error);
      toast.error(texts.memberCrudError);
    }
  };

  const submitUpdateRole = async () => {
    if (!editingUserId) return;

    try {
      await memberMutations.updateMemberRole(editingUserId, editingRole);
      toast.success(texts.memberUpdated);
      closeRoleDialog();
    } catch (error) {
      console.error(error);
      toast.error(texts.memberCrudError);
    }
  };

  const confirmDelete = async () => {
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
  };

  return {
    draftUserId,
    draftRole,
    editingUserId,
    editingRole,
    pendingDeleteUserId,
    isAddDialogOpen,
    isRoleDialogOpen,
    isSubmitting,
    setDraftUserId,
    setDraftRole,
    setEditingRole,
    openAddDialog,
    closeAddDialog,
    openRoleDialog,
    closeRoleDialog,
    requestDelete,
    cancelDelete,
    submitAddMember,
    submitUpdateRole,
    confirmDelete,
  };
};
