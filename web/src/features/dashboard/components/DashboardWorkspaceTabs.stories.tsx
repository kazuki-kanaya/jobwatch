import type { Meta, StoryObj } from "@storybook/react-vite";
import DashboardWorkspaceTabs from "@/features/dashboard/components/DashboardWorkspaceTabs";

const meta = {
  title: "Features/Dashboard/DashboardWorkspaceTabs",
  component: DashboardWorkspaceTabs,
  parameters: {
    layout: "padded",
    backgrounds: { default: "dark" },
  },
  args: {
    value: "overview",
    overviewLabel: "Overview",
    membersLabel: "Members",
    onChange: () => {},
  },
} satisfies Meta<typeof DashboardWorkspaceTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const Members: Story = {
  args: {
    value: "members",
  },
};
