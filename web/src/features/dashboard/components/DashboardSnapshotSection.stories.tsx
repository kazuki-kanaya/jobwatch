// Responsibility: Provide visual regression stories for dashboard snapshot cards.
import type { Meta, StoryObj } from "@storybook/react-vite";
import DashboardSnapshotSection from "@/features/dashboard/components/DashboardSnapshotSection";

const meta = {
  title: "Features/Dashboard/DashboardSnapshotSection",
  component: DashboardSnapshotSection,
  parameters: {
    layout: "padded",
    backgrounds: { default: "dark" },
  },
  args: {
    snapshot: {
      total: 10,
      running: 4,
      completed: 5,
      failed: 1,
      updatedAt: "2026-02-15 11:40 UTC",
    },
    labels: {
      tracked: "Tracked",
      running: "Running",
      completed: "Completed",
      failed: "Failed",
    },
  },
} satisfies Meta<typeof DashboardSnapshotSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    snapshot: {
      total: 0,
      running: 0,
      completed: 0,
      failed: 0,
      updatedAt: "2026-02-15 11:40 UTC",
    },
  },
};
