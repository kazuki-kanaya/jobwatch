import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkspaceTransferDialog } from "@/features/workspace/components/WorkspaceTransferDialog/WorkspaceTransferDialog";

const meta = {
  title: "Features/Workspace/WorkspaceTransferDialog",
  component: WorkspaceTransferDialog,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  args: {
    title: "Transfer Workspace Owner",
    description: "Choose the next owner for this workspace.",
    ownerUserIdLabel: "New owner",
    transferLabel: "Transfer",
    cancelLabel: "Cancel",
    workspaceId: "ws_001",
    ownerUserId: "",
    ownerOptions: [
      { id: "user_001", name: "kazu" },
      { id: "user_002", name: "team-admin" },
    ],
    isSubmitting: false,
    isOpen: true,
    onClose: () => {},
    onOwnerUserIdChange: () => {},
    onSubmit: () => {},
  },
} satisfies Meta<typeof WorkspaceTransferDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    ownerUserId: "user_002",
  },
};
