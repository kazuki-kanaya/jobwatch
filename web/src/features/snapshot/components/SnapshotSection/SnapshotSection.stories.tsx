import type { Meta, StoryObj } from "@storybook/react-vite";
import { SnapshotSection } from "@/features/snapshot/components/SnapshotSection/SnapshotSection";

const meta = {
  title: "Features/Snapshot/SnapshotSection",
  component: SnapshotSection,
  args: {
    snapshot: {
      tracked: 12,
      running: 3,
      completed: 8,
      failed: 1,
    },
    state: "ready",
    errorLabel: "Failed to load jobs.",
    labels: {
      tracked: "Total",
      running: "Running",
      completed: "Completed",
      failed: "Failed",
    },
  },
} satisfies Meta<typeof SnapshotSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Loading: Story = {
  args: {
    state: "loading",
  },
};

export const ErrorState: Story = {
  args: {
    state: "error",
  },
};

export const Empty: Story = {
  args: {
    snapshot: {
      tracked: 0,
      running: 0,
      completed: 0,
      failed: 0,
    },
  },
};
