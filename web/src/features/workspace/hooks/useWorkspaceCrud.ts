import { useState } from "react";
import { toast } from "sonner";
import type { DashboardViewModel } from "@/features/dashboard/types";
import { useInvitationMutations } from "@/features/invitations/api/useInvitationMutations";
import { useWorkspaceMutations } from "@/features/workspace/api/useWorkspaceMutations";

type UseWorkspaceCrudParams = {
  accessToken: string | undefined;
  workspaceId: string;
  workspaces: DashboardViewModel["filters"]["workspaceOptions"];
  onWorkspaceIdChange: (workspaceId: string) => void;
  texts: Pick<
    DashboardViewModel["texts"],
    | "workspaceCreated"
    | "workspaceUpdated"
    | "workspaceDeleted"
    | "workspaceOwnerTransferred"
    | "workspaceCrudError"
    | "invitationRevoked"
    | "invitationCrudError"
  >;
};

type UseWorkspaceCrudResult = {
  workspaceDraftName: string;
  transferOwnerUserId: string;
  editingWorkspaceId: string | null;
  transferWorkspaceId: string | null;
  pendingDeleteWorkspaceId: string | null;
  pendingRevokeInvitationId: string | null;
  isWorkspaceFormOpen: boolean;
  isWorkspaceTransferDialogOpen: boolean;
  isWorkspaceSubmitting: boolean;
  setWorkspaceDraftName: (value: string) => void;
  setTransferOwnerUserId: (value: string) => void;
  openWorkspaceCreateForm: () => void;
  startEditWorkspace: (workspaceId: string) => void;
  closeWorkspaceForm: () => void;
  submitWorkspace: () => Promise<void>;
  openTransferOwnerDialog: (workspaceId: string) => void;
  closeTransferOwnerDialog: () => void;
  submitTransferOwner: () => Promise<void>;
  requestRevokeInvitation: (invitationId: string) => void;
  cancelRevokeInvitation: () => void;
  confirmRevokeInvitation: () => Promise<void>;
  requestDeleteWorkspace: (workspaceId: string) => void;
  cancelDeleteWorkspace: () => void;
  confirmDeleteWorkspace: () => Promise<void>;
};

export const useWorkspaceCrud = ({
  accessToken,
  workspaceId,
  workspaces,
  onWorkspaceIdChange,
  texts,
}: UseWorkspaceCrudParams): UseWorkspaceCrudResult => {
  const workspaceMutations = useWorkspaceMutations({ accessToken });
  const invitationMutations = useInvitationMutations({ accessToken, workspaceId });
  const [workspaceDraftName, setWorkspaceDraftName] = useState("");
  const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(null);
  const [isWorkspaceFormOpen, setIsWorkspaceFormOpen] = useState(false);
  const [transferOwnerUserId, setTransferOwnerUserId] = useState("");
  const [transferWorkspaceId, setTransferWorkspaceId] = useState<string | null>(null);
  const [isWorkspaceTransferDialogOpen, setIsWorkspaceTransferDialogOpen] = useState(false);
  const [pendingDeleteWorkspaceId, setPendingDeleteWorkspaceId] = useState<string | null>(null);
  const [pendingRevokeInvitationId, setPendingRevokeInvitationId] = useState<string | null>(null);

  const isWorkspaceSubmitting =
    workspaceMutations.isCreating ||
    workspaceMutations.isUpdating ||
    workspaceMutations.isDeleting ||
    workspaceMutations.isTransferringOwner ||
    invitationMutations.isRevokingInvitation;

  const openWorkspaceCreateForm = () => {
    setEditingWorkspaceId(null);
    setWorkspaceDraftName("");
    setIsWorkspaceFormOpen(true);
  };

  const startEditWorkspace = (nextWorkspaceId: string) => {
    const selectedWorkspace = workspaces.find((workspace) => workspace.id === nextWorkspaceId);
    setEditingWorkspaceId(nextWorkspaceId);
    setWorkspaceDraftName(selectedWorkspace?.name ?? "");
    setIsWorkspaceFormOpen(true);
  };

  const closeWorkspaceForm = () => {
    setIsWorkspaceFormOpen(false);
    setEditingWorkspaceId(null);
    setWorkspaceDraftName("");
  };

  const submitWorkspace = async () => {
    const name = workspaceDraftName.trim();
    if (!name) return;

    try {
      if (editingWorkspaceId) {
        await workspaceMutations.updateWorkspace(editingWorkspaceId, name);
        toast.success(texts.workspaceUpdated);
      } else {
        const created = await workspaceMutations.createWorkspace(name);
        onWorkspaceIdChange(created.workspace_id);
        toast.success(texts.workspaceCreated);
      }
      closeWorkspaceForm();
    } catch (error) {
      console.error(error);
      toast.error(texts.workspaceCrudError);
    }
  };

  const openTransferOwnerDialog = (nextWorkspaceId: string) => {
    setTransferWorkspaceId(nextWorkspaceId);
    setTransferOwnerUserId("");
    setIsWorkspaceTransferDialogOpen(true);
  };

  const closeTransferOwnerDialog = () => {
    setTransferWorkspaceId(null);
    setTransferOwnerUserId("");
    setIsWorkspaceTransferDialogOpen(false);
  };

  const submitTransferOwner = async () => {
    const userId = transferOwnerUserId.trim();
    if (!transferWorkspaceId || !userId) return;

    try {
      await workspaceMutations.transferOwner(transferWorkspaceId, userId);
      toast.success(texts.workspaceOwnerTransferred);
      closeTransferOwnerDialog();
    } catch (error) {
      console.error(error);
      toast.error(texts.workspaceCrudError);
    }
  };

  const requestRevokeInvitation = (invitationId: string) => setPendingRevokeInvitationId(invitationId);

  const cancelRevokeInvitation = () => setPendingRevokeInvitationId(null);

  const confirmRevokeInvitation = async () => {
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

  const requestDeleteWorkspace = (nextWorkspaceId: string) => setPendingDeleteWorkspaceId(nextWorkspaceId);

  const cancelDeleteWorkspace = () => setPendingDeleteWorkspaceId(null);

  const confirmDeleteWorkspace = async () => {
    if (!pendingDeleteWorkspaceId) return;

    const deletingWorkspaceId = pendingDeleteWorkspaceId;
    try {
      await workspaceMutations.deleteWorkspace(deletingWorkspaceId);
      const fallbackWorkspace = workspaces.find((workspace) => workspace.id !== deletingWorkspaceId);
      if (workspaceId === deletingWorkspaceId) {
        onWorkspaceIdChange(fallbackWorkspace?.id ?? "");
      }
      toast.success(texts.workspaceDeleted);
    } catch (error) {
      console.error(error);
      toast.error(texts.workspaceCrudError);
    } finally {
      setPendingDeleteWorkspaceId(null);
    }
  };

  return {
    workspaceDraftName,
    transferOwnerUserId,
    editingWorkspaceId,
    transferWorkspaceId,
    pendingDeleteWorkspaceId,
    pendingRevokeInvitationId,
    isWorkspaceFormOpen,
    isWorkspaceTransferDialogOpen,
    isWorkspaceSubmitting,
    setWorkspaceDraftName,
    setTransferOwnerUserId,
    openWorkspaceCreateForm,
    startEditWorkspace,
    closeWorkspaceForm,
    submitWorkspace,
    openTransferOwnerDialog,
    closeTransferOwnerDialog,
    submitTransferOwner,
    requestRevokeInvitation,
    cancelRevokeInvitation,
    confirmRevokeInvitation,
    requestDeleteWorkspace,
    cancelDeleteWorkspace,
    confirmDeleteWorkspace,
  };
};
