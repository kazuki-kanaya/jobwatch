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
    activeWorkspaceId: "ws-001",
    newOwnerUserIdLabel: "New owner user ID",
    transferOwnerLabel: "Transfer owner",
    addLabel: "Add",
    editLabel: "Edit",
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
    workspaceDraftName: "",
    transferOwnerUserId: "",
    transferOwnerOptions: [
      { id: "user-001", name: "kazu (user-001)" },
      { id: "user-002", name: "user-002" },
    ],
    editingWorkspaceId: null,
    transferWorkspaceId: null,
    pendingDeleteWorkspaceId: null,
    isLoading: false,
    isError: false,
    isSubmitting: false,
    isFormOpen: false,
    isTransferDialogOpen: false,
    onSelectWorkspace: () => {},
    onOpenCreate: () => {},
    onStartEdit: () => {},
    onDraftNameChange: () => {},
    onCloseForm: () => {},
    onSubmitWorkspace: () => {},
    onOpenTransfer: () => {},
    onTransferOwnerUserIdChange: () => {},
    onCloseTransfer: () => {},
    onSubmitTransfer: () => {},
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
