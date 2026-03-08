import type { Meta, StoryObj } from "@storybook/react-vite";
import { HostItem } from "@/features/host/components/HostItem/HostItem";

const meta = {
  title: "Features/Host/HostItem",
  component: HostItem,
  args: {
    host: {
      id: "host-21f9c329",
      name: "runner-tokyo-01",
    },
    canManage: true,
    editLabel: "Edit",
    deleteLabel: "Delete",
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
    },
  },
};
