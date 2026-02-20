import type { Meta, StoryObj } from "@storybook/react-vite";
import DashboardWorkspaceContextCard from "@/features/dashboard/components/DashboardWorkspaceContextCard";

const meta = {
  title: "Features/Dashboard/DashboardWorkspaceContextCard",
  component: DashboardWorkspaceContextCard,
  parameters: {
    layout: "padded",
    backgrounds: { default: "dark" },
  },
  args: {
    label: "Current Workspace",
    name: "Production-Cluster-A",
    hint: "All jobs, hosts, and members below are scoped to this workspace.",
  },
} satisfies Meta<typeof DashboardWorkspaceContextCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
