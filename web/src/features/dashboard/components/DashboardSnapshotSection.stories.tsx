import type { Meta, StoryObj } from "@storybook/react-vite";
import DashboardSnapshotSection from "@/features/dashboard/components/DashboardSnapshotSection";

const meta = {
  title: "Features/Dashboard/DashboardSnapshotSection",
  component: DashboardSnapshotSection,
  args: {
    snapshot: {
      total: 10,
      running: 4,
      completed: 5,
      canceled: 1,
      failed: 1,
      updatedAt: "2026-02-15 11:40 UTC",
    },
    labels: {
      tracked: "Total",
      running: "Running",
      completed: "Completed",
      canceled: "Canceled",
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
      canceled: 0,
      failed: 0,
      updatedAt: "2026-02-15 11:40 UTC",
    },
  },
};
