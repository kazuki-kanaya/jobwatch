import type { Meta, StoryObj } from "@storybook/react-vite";
import { HostFormDialog } from "@/features/host/components/HostFormDialog/HostFormDialog";

const meta = {
  title: "Features/Host/HostFormDialog",
  component: HostFormDialog,
  args: {
    title: "Add host",
    description: "Register a runner host for this workspace.",
    hostNameLabel: "Host name",
    createLabel: "Add",
    updateLabel: "Update",
    cancelLabel: "Cancel",
    hostDraftName: "",
    isEditing: false,
    isSubmitting: false,
    isOpen: true,
    onClose: () => {},
    onHostDraftNameChange: () => {},
    onSubmit: () => {},
  },
} satisfies Meta<typeof HostFormDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {};

export const Edit: Story = {
  args: {
    title: "Edit host",
    hostDraftName: "runner-tokyo-01",
    isEditing: true,
  },
};

export const Submitting: Story = {
  args: {
    hostDraftName: "runner-tokyo-01",
    isSubmitting: true,
  },
};
