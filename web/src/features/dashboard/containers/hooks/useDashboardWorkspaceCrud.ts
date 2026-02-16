// Responsibility: Manage workspace CRUD and ownership transfer dialog state with toast feedback.
import { useState } from "react";
import { toast } from "sonner";
import { useDashboardInvitationMutations } from "@/features/dashboard/api/dashboardInvitationMutations";
import { useDashboardWorkspaceMutations } from "@/features/dashboard/api/dashboardWorkspaceMutations";
import type { DashboardViewModel } from "@/features/dashboard/types";

type UseDashboardWorkspaceCrudParams = {
  accessToken: string | undefined;
  workspaceId: string;
  workspaces: DashboardViewModel["filters"]["workspaceOptions"];
  onWorkspaceChange: (workspaceId: string) => void;
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

type UseDashboardWorkspaceCrudResult = {
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

export const useDashboardWorkspaceCrud = ({
  accessToken,
  workspaceId,
  workspaces,
  onWorkspaceChange,
  texts,
}: UseDashboardWorkspaceCrudParams): UseDashboardWorkspaceCrudResult => {
  const workspaceMutations = useDashboardWorkspaceMutations({ accessToken });
  const invitationMutations = useDashboardInvitationMutations({ accessToken, workspaceId });
  const [workspaceDraftName, setWorkspaceDraftName] = useState("");
  const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(null);
  const [isWorkspaceFormOpen, setIsWorkspaceFormOpen] = useState(false);

  const [transferOwnerUserId, setTransferOwnerUserId] = useState("");
  const [transferWorkspaceId, setTransferWorkspaceId] = useState<string | null>(null);
  const [isWorkspaceTransferDialogOpen, setIsWorkspaceTransferDialogOpen] = useState(false);

  const [pendingDeleteWorkspaceId, setPendingDeleteWorkspaceId] = useState<string | null>(null);
  const [pendingRevokeInvitationId, setPendingRevokeInvitationId] = useState<string | null>(null);

  return {
    workspaceDraftName,
    transferOwnerUserId,
    editingWorkspaceId,
    transferWorkspaceId,
    pendingDeleteWorkspaceId,
    pendingRevokeInvitationId,
    isWorkspaceFormOpen,
    isWorkspaceTransferDialogOpen,
    isWorkspaceSubmitting:
      workspaceMutations.isCreating ||
      workspaceMutations.isUpdating ||
      workspaceMutations.isDeleting ||
      workspaceMutations.isTransferringOwner ||
      invitationMutations.isRevokingInvitation,
    setWorkspaceDraftName,
    setTransferOwnerUserId,
    openWorkspaceCreateForm: () => {
      setEditingWorkspaceId(null);
      setWorkspaceDraftName("");
      setIsWorkspaceFormOpen(true);
    },
    startEditWorkspace: (nextWorkspaceId) => {
      const selectedWorkspace = workspaces.find((workspace) => workspace.id === nextWorkspaceId);
      setEditingWorkspaceId(nextWorkspaceId);
      setWorkspaceDraftName(selectedWorkspace?.name ?? "");
      setIsWorkspaceFormOpen(true);
    },
    closeWorkspaceForm: () => {
      setIsWorkspaceFormOpen(false);
      setEditingWorkspaceId(null);
      setWorkspaceDraftName("");
    },
    submitWorkspace: async () => {
      const name = workspaceDraftName.trim();
      if (!name) return;

      try {
        if (editingWorkspaceId) {
          await workspaceMutations.updateWorkspace(editingWorkspaceId, name);
          toast.success(texts.workspaceUpdated);
        } else {
          const created = await workspaceMutations.createWorkspace(name);
          onWorkspaceChange(created.workspace_id);
          toast.success(texts.workspaceCreated);
        }
        setIsWorkspaceFormOpen(false);
        setEditingWorkspaceId(null);
        setWorkspaceDraftName("");
      } catch (error) {
        console.error(error);
        toast.error(texts.workspaceCrudError);
      }
    },
    openTransferOwnerDialog: (nextWorkspaceId) => {
      setTransferWorkspaceId(nextWorkspaceId);
      setTransferOwnerUserId("");
      setIsWorkspaceTransferDialogOpen(true);
    },
    closeTransferOwnerDialog: () => {
      setTransferWorkspaceId(null);
      setTransferOwnerUserId("");
      setIsWorkspaceTransferDialogOpen(false);
    },
    submitTransferOwner: async () => {
      const userId = transferOwnerUserId.trim();
      if (!transferWorkspaceId || !userId) return;

      try {
        await workspaceMutations.transferOwner(transferWorkspaceId, userId);
        toast.success(texts.workspaceOwnerTransferred);
        setTransferWorkspaceId(null);
        setTransferOwnerUserId("");
        setIsWorkspaceTransferDialogOpen(false);
      } catch (error) {
        console.error(error);
        toast.error(texts.workspaceCrudError);
      }
    },
    requestRevokeInvitation: (invitationId) => setPendingRevokeInvitationId(invitationId),
    cancelRevokeInvitation: () => setPendingRevokeInvitationId(null),
    confirmRevokeInvitation: async () => {
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
    },
    requestDeleteWorkspace: (nextWorkspaceId) => setPendingDeleteWorkspaceId(nextWorkspaceId),
    cancelDeleteWorkspace: () => setPendingDeleteWorkspaceId(null),
    confirmDeleteWorkspace: async () => {
      if (!pendingDeleteWorkspaceId) return;

      const deletingWorkspaceId = pendingDeleteWorkspaceId;
      try {
        await workspaceMutations.deleteWorkspace(deletingWorkspaceId);
        const fallbackWorkspace = workspaces.find((workspace) => workspace.id !== deletingWorkspaceId);
        if (workspaceId === deletingWorkspaceId) {
          onWorkspaceChange(fallbackWorkspace?.id ?? "");
        }
        toast.success(texts.workspaceDeleted);
      } catch (error) {
        console.error(error);
        toast.error(texts.workspaceCrudError);
      } finally {
        setPendingDeleteWorkspaceId(null);
      }
    },
  };
};
