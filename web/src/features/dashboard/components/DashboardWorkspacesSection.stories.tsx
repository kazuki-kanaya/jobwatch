// Responsibility: Provide visual regression stories for workspace management section states.
import type { Meta, StoryObj } from "@storybook/react-vite";
import DashboardWorkspacesSection from "@/features/dashboard/components/DashboardWorkspacesSection";

const meta = {
  title: "Features/Dashboard/DashboardWorkspacesSection",
  component: DashboardWorkspacesSection,
  parameters: {
    layout: "padded",
    backgrounds: { default: "dark" },
  },
  args: {
    title: "Workspaces",
    workspaceNameLabel: "Workspace name",
    activeWorkspaceName: "Research",
    newOwnerUserIdLabel: "New owner user ID",
    transferOwnerLabel: "Transfer owner",
    invitationsTitle: "Invitations",
    invitationRoleLabel: "Role",
    invitationCreatedByLabel: "Created by",
    invitationExpiresAtLabel: "Expires at",
    invitationUsedAtLabel: "Used at",
    invitationStatusActiveLabel: "active",
    invitationStatusUsedLabel: "used",
    invitationStatusExpiredLabel: "expired",
    invitationRevokeConfirmTitle: "Revoke invitation?",
    invitationRevokeConfirmDescription: "This invitation URL will no longer be valid.",
    revokeLabel: "Delete",
    invitationsEmptyLabel: "No invitations yet.",
    invitationsErrorLabel: "Failed to load invitations.",
    addLabel: "Add",
    updateLabel: "Update",
    cancelLabel: "Cancel",
    deleteLabel: "Delete",
    emptyLabel: "No workspaces yet.",
    errorLabel: "Failed to load workspaces.",
    deleteConfirmTitle: "Delete workspace?",
    deleteConfirmDescription: "Workspace data and related resources are removed.",
    noPermissionLabel: "You do not have permission for this action.",
    canCreate: true,
    canManage: true,
    workspaces: [
      { id: "ws-001", name: "Research" },
      { id: "ws-002", name: "Production" },
    ],
    invitations: [
      {
        id: "inv-001",
        role: "viewer",
        createdByUserId: "user-001",
        expiresAtIso: "2026-03-01T10:00:00Z",
        expiresAt: "2026-03-01 10:00",
        usedAt: null,
      },
      {
        id: "inv-002",
        role: "editor",
        createdByUserId: "user-001",
        expiresAtIso: "2025-03-01T10:00:00Z",
        expiresAt: "2025-03-01 10:00",
        usedAt: null,
      },
      {
        id: "inv-003",
        role: "viewer",
        createdByUserId: "user-002",
        expiresAtIso: "2026-02-01T10:00:00Z",
        expiresAt: "2026-02-01 10:00",
        usedAt: "2026-01-10 09:20",
      },
    ],
    workspaceDraftName: "",
    transferOwnerUserId: "",
    transferOwnerOptions: [
      { id: "user-001", name: "kazu (user-001)" },
      { id: "user-002", name: "user-002" },
    ],
    editingWorkspaceId: null,
    transferWorkspaceId: null,
    pendingDeleteWorkspaceId: null,
    pendingRevokeInvitationId: null,
    isLoading: false,
    isError: false,
    isInvitationsLoading: false,
    isInvitationsError: false,
    isSubmitting: false,
    isFormOpen: false,
    isTransferDialogOpen: false,
    onOpenCreate: () => {},
    onStartEdit: () => {},
    onDraftNameChange: () => {},
    onCloseForm: () => {},
    onSubmitWorkspace: () => {},
    onOpenTransfer: () => {},
    onTransferOwnerUserIdChange: () => {},
    onCloseTransfer: () => {},
    onSubmitTransfer: () => {},
    onRequestRevokeInvitation: () => {},
    onCancelRevokeInvitation: () => {},
    onConfirmRevokeInvitation: () => {},
    onRequestDelete: () => {},
    onCancelDelete: () => {},
    onConfirmDelete: () => {},
  },
} satisfies Meta<typeof DashboardWorkspacesSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    workspaces: [],
  },
};

export const ReadOnly: Story = {
  args: {
    canCreate: true,
    canManage: false,
  },
};
