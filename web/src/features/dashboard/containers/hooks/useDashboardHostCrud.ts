// Responsibility: Manage host CRUD state transitions and mutations with user feedback.
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useDashboardHostMutations } from "@/features/dashboard/api/dashboardHostMutations";
import type { DashboardHostItem, DashboardViewModel } from "@/features/dashboard/types";

type UseDashboardHostCrudParams = {
  accessToken: string | undefined;
  workspaceId: string;
  hosts: DashboardHostItem[];
  texts: Pick<
    DashboardViewModel["texts"],
    "hostCreated" | "hostUpdated" | "hostDeleted" | "hostCrudError" | "hostTokenCopied" | "hostTokenCopyError"
  >;
};

type UseDashboardHostCrudResult = {
  hostDraftName: string;
  editingHostId: string | null;
  hostToken: string | null;
  hostTokenMessage: string | null;
  isHostSubmitting: boolean;
  isHostFormOpen: boolean;
  pendingDeleteHostId: string | null;
  setHostDraftName: (value: string) => void;
  openCreateHostForm: () => void;
  startEditHost: (hostId: string) => void;
  closeHostForm: () => void;
  submitHost: () => Promise<void>;
  copyHostToken: () => Promise<void>;
  requestDeleteHost: (hostId: string) => void;
  cancelDeleteHost: () => void;
  confirmDeleteHost: () => Promise<void>;
};

export const useDashboardHostCrud = ({
  accessToken,
  workspaceId,
  hosts,
  texts,
}: UseDashboardHostCrudParams): UseDashboardHostCrudResult => {
  const [hostDraftName, setHostDraftName] = useState("");
  const [editingHostId, setEditingHostId] = useState<string | null>(null);
  const [hostToken, setHostToken] = useState<string | null>(null);
  const [hostTokenMessage, setHostTokenMessage] = useState<string | null>(null);
  const [isHostFormOpen, setIsHostFormOpen] = useState(false);
  const [pendingDeleteHostId, setPendingDeleteHostId] = useState<string | null>(null);

  const hostMutations = useDashboardHostMutations({ accessToken, workspaceId });
  const hostById = useMemo(() => new Map(hosts.map((host) => [host.id, host.name])), [hosts]);

  const closeHostForm = () => {
    setIsHostFormOpen(false);
    setEditingHostId(null);
    setHostDraftName("");
  };

  return {
    hostDraftName,
    editingHostId,
    hostToken,
    hostTokenMessage,
    isHostFormOpen,
    pendingDeleteHostId,
    isHostSubmitting: hostMutations.isCreating || hostMutations.isUpdating || hostMutations.isDeleting,
    setHostDraftName,
    openCreateHostForm: () => {
      setHostToken(null);
      setHostTokenMessage(null);
      setEditingHostId(null);
      setHostDraftName("");
      setIsHostFormOpen(true);
    },
    startEditHost: (hostId) => {
      setHostToken(null);
      setHostTokenMessage(null);
      setEditingHostId(hostId);
      setHostDraftName(hostById.get(hostId) ?? "");
      setIsHostFormOpen(true);
    },
    closeHostForm,
    submitHost: async () => {
      const normalizedName = hostDraftName.trim();
      if (!normalizedName) return;

      try {
        if (editingHostId) {
          await hostMutations.updateHost(editingHostId, normalizedName);
          toast.success(texts.hostUpdated);
        } else {
          const created = await hostMutations.createHost(normalizedName);
          setHostToken(created.token);
          setHostTokenMessage(created.message);
          toast.success(texts.hostCreated);
        }
        closeHostForm();
      } catch (error) {
        console.error(error);
        toast.error(texts.hostCrudError);
      }
    },
    copyHostToken: async () => {
      if (!hostToken) return;

      try {
        await navigator.clipboard.writeText(hostToken);
        toast.success(texts.hostTokenCopied);
      } catch (error) {
        console.error(error);
        toast.error(texts.hostTokenCopyError);
      }
    },
    requestDeleteHost: (hostId) => setPendingDeleteHostId(hostId),
    cancelDeleteHost: () => setPendingDeleteHostId(null),
    confirmDeleteHost: async () => {
      if (!pendingDeleteHostId) return;
      try {
        await hostMutations.deleteHost(pendingDeleteHostId);
        toast.success(texts.hostDeleted);
      } catch (error) {
        console.error(error);
        toast.error(texts.hostCrudError);
      } finally {
        setPendingDeleteHostId(null);
      }
    },
  };
};
