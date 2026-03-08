import type { Meta, StoryObj } from "@storybook/react-vite";
import { HostCreateButton } from "@/features/host/components/HostCreateButton/HostCreateButton";

const meta = {
  title: "Features/Host/HostCreateButton",
  component: HostCreateButton,
  args: {
    addLabel: "Add",
    noPermissionLabel: "No permission",
    canCreate: true,
    onCreateHost: () => {},
  },
} satisfies Meta<typeof HostCreateButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Disabled: Story = {
  args: {
    canCreate: false,
  },
};
