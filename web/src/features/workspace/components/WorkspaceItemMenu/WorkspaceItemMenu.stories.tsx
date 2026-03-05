import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkspaceItemMenu } from "@/features/workspace/components/WorkspaceItemMenu/WorkspaceItemMenu";

const meta = {
  title: "Features/Workspace/WorkspaceItemMenu",
  component: WorkspaceItemMenu,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  args: {
    workspaceId: "ws_001",
    canManage: true,
    editLabel: "Edit",
    transferOwnerLabel: "Transfer Owner",
    deleteLabel: "Delete",
    onEditWorkspace: () => {},
    onTransferWorkspaceOwner: () => {},
    onDeleteWorkspace: () => {},
  },
} satisfies Meta<typeof WorkspaceItemMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    canManage: false,
  },
};
