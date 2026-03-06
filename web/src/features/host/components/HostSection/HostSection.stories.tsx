import type { Meta, StoryObj } from "@storybook/react-vite";
import { HostSection } from "@/features/host/components/HostSection/HostSection";

const hosts = [
  { id: "host_001", name: "runner-tokyo-01" },
  { id: "host_002", name: "runner-tokyo-02" },
];

const meta = {
  title: "Features/Host/HostSection",
  component: HostSection,
  parameters: {
    layout: "padded",
    backgrounds: { default: "dark" },
  },
  args: {
    title: "Hosts",
    emptyLabel: "No hosts yet.",
    errorLabel: "Failed to load hosts.",
    state: "ready",
    hosts,
    canCreate: true,
    canManage: true,
    noPermissionLabel: "No permission",
    addLabel: "Add",
    editLabel: "Edit",
    deleteLabel: "Delete",
    hostNameLabel: "Host name",
    createLabel: "Add",
    updateLabel: "Update",
    formTitle: "Create host",
    formDescription: "Register a runner host for this workspace.",
    deleteDialogTitle: "Delete host?",
    deleteDialogDescription: "Jobs associated with this host will also be removed.",
    tokenDialogTitle: "Host token",
    tokenDialogDescription: "Save this token securely. It is only shown now.",
    tokenLabel: "Host connection token",
    tokenCopyLabel: "Copy token",
    closeLabel: "Close",
    cancelLabel: "Cancel",
    isSubmitting: false,
    isFormOpen: false,
    isDeleteDialogOpen: false,
    hostDraftName: "",
    isEditing: false,
    hostToken: null,
    hostTokenMessage: null,
    onCreateHost: () => {},
    onEditHost: () => {},
    onDeleteHost: () => {},
    onHostDraftNameChange: () => {},
    onSubmitHost: () => {},
    onSubmitDeleteHost: () => {},
    onCloseHostForm: () => {},
    onCloseDeleteDialog: () => {},
    onCopyHostToken: () => {},
    onCloseHostTokenDialog: () => {},
  },
} satisfies Meta<typeof HostSection>;

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
    hosts: [],
  },
};

export const ErrorState: Story = {
  args: {
    state: "error",
  },
};

export const TokenIssued: Story = {
  args: {
    hostToken: "obsern_host_token_xxxxxxxxxxxxxxxxx",
    hostTokenMessage: "Store this token securely. It won't be shown again.",
  },
};
