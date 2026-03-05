import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkspaceDeleteDialog } from "@/features/workspace/components/WorkspaceDeleteDialog/WorkspaceDeleteDialog";

const meta = {
  title: "Features/Workspace/WorkspaceDeleteDialog",
  component: WorkspaceDeleteDialog,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  args: {
    title: "Delete Workspace",
    description: "This action cannot be undone.",
    cancelLabel: "Cancel",
    confirmLabel: "Delete",
    isSubmitting: false,
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
  },
} satisfies Meta<typeof WorkspaceDeleteDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};
