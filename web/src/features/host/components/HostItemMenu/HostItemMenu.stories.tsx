import type { Meta, StoryObj } from "@storybook/react-vite";
import { HostItemMenu } from "@/features/host/components/HostItemMenu/HostItemMenu";

const meta = {
  title: "Features/Host/HostItemMenu",
  component: HostItemMenu,
  args: {
    hostId: "host-21f9c329",
    canManage: true,
    editLabel: "Edit",
    deleteLabel: "Delete",
    onEditHost: () => {},
    onDeleteHost: () => {},
  },
} satisfies Meta<typeof HostItemMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Disabled: Story = {
  args: {
    canManage: false,
  },
};
