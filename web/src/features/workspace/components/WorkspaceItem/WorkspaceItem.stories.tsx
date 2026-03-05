import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkspaceItem } from "@/features/workspace/components/WorkspaceItem/WorkspaceItem";

const meta = {
  title: "Features/Workspace/WorkspaceItem",
  component: WorkspaceItem,
  parameters: {
    layout: "padded",
    backgrounds: { default: "dark" },
  },
  args: {
    workspace: { id: "ws_001", name: "Platform Infra" },
    isActive: true,
    canManage: true,
    editLabel: "Edit",
    transferOwnerLabel: "Transfer Owner",
    deleteLabel: "Delete",
    onSelectWorkspace: () => {},
    onEditWorkspace: () => {},
    onTransferWorkspaceOwner: () => {},
    onDeleteWorkspace: () => {},
  },
} satisfies Meta<typeof WorkspaceItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {};

export const Inactive: Story = {
  args: {
    isActive: false,
    workspace: { id: "ws_002", name: "ML Experiments" },
  },
};

export const NoManagePermission: Story = {
  args: {
    canManage: false,
  },
};
