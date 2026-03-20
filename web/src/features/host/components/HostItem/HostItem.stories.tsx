import type { Meta, StoryObj } from "@storybook/react-vite";
import { HostItem } from "@/features/host/components/HostItem/HostItem";

const meta = {
  title: "Features/Host/HostItem",
  component: HostItem,
  args: {
    host: {
      id: "host-21f9c329",
      name: "runner-tokyo-01",
      snapshot: {
        tracked: 8,
        running: 2,
        completed: 5,
        canceled: 0,
        failed: 1,
      },
      snapshotState: "ready",
    },
    canManage: true,
    editLabel: "Edit",
    deleteLabel: "Delete",
    snapshotLabels: {
      tracked: "Tracked",
      running: "Running",
      completed: "Completed",
      canceled: "Canceled",
      failed: "Failed",
    },
    onEditHost: () => {},
    onDeleteHost: () => {},
  },
} satisfies Meta<typeof HostItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const ReadOnly: Story = {
  args: {
    canManage: false,
  },
};

export const LongName: Story = {
  args: {
    host: {
      id: "host-bec4f303-88a2-4419-9a53-5e4ddf11bfe1",
      name: "runner-tokyo-production-cluster-gpu-a100-node-01",
      snapshot: {
        tracked: 12,
        running: 3,
        completed: 8,
        canceled: 0,
        failed: 1,
      },
      snapshotState: "ready",
    },
  },
};

export const SnapshotLoading: Story = {
  args: {
    host: {
      id: "host-21f9c329",
      name: "runner-tokyo-01",
      snapshot: {
        tracked: 0,
        running: 0,
        completed: 0,
        canceled: 0,
        failed: 0,
      },
      snapshotState: "loading",
    },
  },
};
