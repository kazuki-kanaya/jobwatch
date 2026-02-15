// Responsibility: Provide visual regression stories for dashboard filter section states.
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
    workspace: "Workspace: all",
    host: "Host: all",
    query: "Search: failed",
    title: "Filters",
    applyLabel: "Apply",
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
