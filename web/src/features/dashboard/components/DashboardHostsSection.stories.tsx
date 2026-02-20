import type { Meta, StoryObj } from "@storybook/react-vite";
import DashboardHostsSection from "@/features/dashboard/components/DashboardHostsSection";

const meta = {
  title: "Features/Dashboard/DashboardHostsSection",
  component: DashboardHostsSection,
  parameters: {
    layout: "padded",
    backgrounds: { default: "dark" },
  },
  args: {
    title: "Hosts",
    hostNameLabel: "Host name",
    addLabel: "Add",
    editLabel: "Edit",
    updateLabel: "Update",
    cancelLabel: "Cancel",
    deleteLabel: "Delete",
    emptyLabel: "No hosts yet.",
    errorLabel: "Failed to load hosts.",
    noPermissionLabel: "You do not have permission for this action.",
    canManage: true,
    tokenLabel: "Host token",
    tokenCopyLabel: "Copy token",
    tokenValue: null,
    tokenMessage: null,
    deleteConfirmTitle: "Delete host?",
    deleteConfirmDescription: "This also removes jobs associated with this host.",
    draftName: "gpu-l4-03",
    editingHostId: null,
    hosts: [
      { id: "h1", name: "gpu-a100-01" },
      { id: "h2", name: "gpu-l4-03" },
    ],
    isLoading: false,
    isError: false,
    isSubmitting: false,
    isFormOpen: false,
    pendingDeleteHostId: null,
    onOpenCreate: () => {},
    onDraftNameChange: () => {},
    onSubmit: () => {},
    onCopyToken: () => {},
    onDismissToken: () => {},
    onStartEdit: () => {},
    onCloseForm: () => {},
    onRequestDelete: () => {},
    onCancelDelete: () => {},
    onConfirmDelete: () => {},
  },
} satisfies Meta<typeof DashboardHostsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    hosts: [],
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    hosts: [],
  },
};

export const ReadOnly: Story = {
  args: {
    canManage: false,
  },
};

export const TokenIssued: Story = {
  args: {
    tokenValue: "jobwatch_hst_abc123def456",
    tokenMessage: "Save this token securely. It will not be shown again.",
  },
};
