import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkspaceSummary } from "@/features/workspace/components/WorkspaceSummary/WorkspaceSummary";

const meta = {
  title: "Features/Workspace/WorkspaceSummary",
  component: WorkspaceSummary,
  parameters: {
    layout: "padded",
    backgrounds: { default: "dark" },
  },
  args: {
    title: "Current Workspace",
    workspaceId: "ws_001",
    workspaceName: "Platform Infra",
    hint: "Scope for hosts, jobs, and members.",
  },
} satisfies Meta<typeof WorkspaceSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
