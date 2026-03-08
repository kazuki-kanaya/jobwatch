import type { Meta, StoryObj } from "@storybook/react-vite";
import { HostDeleteDialog } from "@/features/host/components/HostDeleteDialog/HostDeleteDialog";

const meta = {
  title: "Features/Host/HostDeleteDialog",
  component: HostDeleteDialog,
  args: {
    title: "Delete host?",
    description: "Jobs associated with this host will also be removed.",
    cancelLabel: "Cancel",
    confirmLabel: "Delete",
    isSubmitting: false,
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
  },
} satisfies Meta<typeof HostDeleteDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};
