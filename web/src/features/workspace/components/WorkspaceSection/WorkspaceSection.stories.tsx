import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkspaceSection } from "@/features/workspace/components/WorkspaceSection/WorkspaceSection";

const workspaces = [
  { id: "ws_001", name: "Platform Infra" },
  { id: "ws_002", name: "ML Experiments" },
  { id: "ws_003", name: "Internal Tools" },
];

const ownerOptions = [
  { id: "user_001", name: "kazu" },
  { id: "user_002", name: "team-admin" },
];

const meta = {
  title: "Features/Workspace/WorkspaceSection",
  component: WorkspaceSection,
  parameters: {
    layout: "padded",
    backgrounds: { default: "dark" },
  },
  args: {
    title: "Workspaces",
    summaryLabel: "Current Workspace",
    summaryHint: "Scope for hosts, jobs, and members.",
    emptyLabel: "No workspaces yet.",
    errorLabel: "Failed to load workspaces.",
    state: "ready",
    activeWorkspaceId: "ws_001",
    selectedWorkspaceName: "Platform Infra",
    workspaces,
    ownerOptions,
    canCreate: true,
    canManage: true,
    noPermissionLabel: "No permission",
    editLabel: "Edit",
    addLabel: "Create",
    deleteLabel: "Delete",
    transferOwnerLabel: "Transfer Owner",
    formTitle: "Create Workspace",
    formDescription: "Create a new workspace scope.",
    workspaceNameLabel: "Workspace name",
    createLabel: "Create",
    updateLabel: "Update",
    transferDialogTitle: "Transfer Workspace Owner",
    transferDialogDescription: "Choose the next owner for this workspace.",
    ownerUserIdLabel: "New owner",
    deleteDialogTitle: "Delete Workspace",
    deleteDialogDescription: "This action cannot be undone.",
    cancelLabel: "Cancel",
    isSubmitting: false,
    isFormOpen: false,
    isDeleteDialogOpen: false,
    isTransferDialogOpen: false,
    isEditing: false,
    transferWorkspaceId: null,
    workspaceDraftName: "",
    transferOwnerUserId: "",
    onSelectWorkspace: () => {},
    onCreateWorkspace: () => {},
    onEditWorkspace: () => {},
    onDeleteWorkspace: () => {},
    onTransferWorkspaceOwner: () => {},
    onWorkspaceDraftNameChange: () => {},
    onTransferOwnerUserIdChange: () => {},
    onSubmitWorkspace: () => {},
    onSubmitDeleteWorkspace: () => {},
    onSubmitTransferWorkspaceOwner: () => {},
    onCloseWorkspaceForm: () => {},
    onCloseDeleteDialog: () => {},
    onCloseTransferDialog: () => {},
  },
} satisfies Meta<typeof WorkspaceSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Loading: Story = {
  args: {
    state: "loading",
  },
};

export const Empty: Story = {
  args: {
    state: "empty",
    workspaces: [],
    activeWorkspaceId: "",
    selectedWorkspaceName: "-",
  },
};

export const ErrorState: Story = {
  args: {
    state: "error",
  },
};
