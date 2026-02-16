import type { Meta, StoryObj } from "@storybook/react-vite";
import DashboardFiltersSection from "@/features/dashboard/components/DashboardFiltersSection";

const meta = {
  title: "Features/Dashboard/DashboardFiltersSection",
  component: DashboardFiltersSection,
  parameters: {
    layout: "padded",
    backgrounds: { default: "dark" },
  },
  args: {
    workspaceLabel: "Workspace",
    hostLabel: "Host",
    queryLabel: "Search",
    workspaceOptions: [
      { id: "all", name: "all" },
      { id: "vision-lab", name: "vision-lab" },
    ],
    hostOptions: [
      { id: "all", name: "all" },
      { id: "gpu-a100-01", name: "gpu-a100-01" },
    ],
    workspaceId: "all",
    hostId: "all",
    query: "failed",
    title: "Filters",
    applyLabel: "Apply",
    onWorkspaceChange: () => {},
    onHostChange: () => {},
    onQueryChange: () => {},
    onApply: () => {},
  },
} satisfies Meta<typeof DashboardFiltersSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyQuery: Story = {
  args: {
    query: "",
  },
};
