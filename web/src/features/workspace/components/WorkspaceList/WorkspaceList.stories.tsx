import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkspaceList } from "@/features/workspace/components/WorkspaceList/WorkspaceList";

const items = [
  { id: "ws_001", name: "Platform Infra" },
  { id: "ws_002", name: "ML Experiments" },
  { id: "ws_003", name: "Internal Tools" },
];

const meta = {
  title: "Features/Workspace/WorkspaceList",
  component: WorkspaceList,
  args: {
    items,
    activeWorkspaceId: "ws_001",
    isLoading: false,
    isError: false,
    emptyLabel: "No workspaces yet.",
    errorLabel: "Failed to load workspaces.",
    editLabel: "Edit",
    transferOwnerLabel: "Transfer Owner",
    deleteLabel: "Delete",
    canManage: true,
    onSelectWorkspace: () => {},
    onEditWorkspace: () => {},
    onTransferWorkspaceOwner: () => {},
    onDeleteWorkspace: () => {},
  },
} satisfies Meta<typeof WorkspaceList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const ErrorState: Story = {
  args: {
    isError: true,
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};
