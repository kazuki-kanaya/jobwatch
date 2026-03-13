import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkspaceHeader } from "@/features/workspace/components/WorkspaceHeader/WorkspaceHeader";

const meta = {
  title: "Features/Workspace/WorkspaceHeader",
  component: WorkspaceHeader,
  args: {
    title: "Current Workspace",
    workspaceId: "ws_001",
    workspaceName: "Platform Infra",
    hint: "Scope for hosts, jobs, and members.",
  },
} satisfies Meta<typeof WorkspaceHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
