import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkspaceCreateButton } from "@/features/workspace/components/WorkspaceCreateButton/WorkspaceCreateButton";

const meta = {
  title: "Features/Workspace/WorkspaceCreateButton",
  component: WorkspaceCreateButton,

  args: {
    addLabel: "Create",
    noPermissionLabel: "No permission",
    canCreate: true,
    onCreateWorkspace: () => {},
  },
} satisfies Meta<typeof WorkspaceCreateButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const ReadOnly: Story = {
  args: {
    canCreate: false,
  },
};
