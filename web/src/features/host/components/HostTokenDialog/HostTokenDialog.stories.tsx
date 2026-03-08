import type { Meta, StoryObj } from "@storybook/react-vite";
import { HostTokenDialog } from "@/features/host/components/HostTokenDialog/HostTokenDialog";

const meta = {
  title: "Features/Host/HostTokenDialog",
  component: HostTokenDialog,
  args: {
    title: "Host connection token",
    description: "ws_1",
    tokenLabel: "Host token",
    copyLabel: "Copy token",
    closeLabel: "Close",
    token: "9dcb52be6f6e28bafe1557f5c6a2cb11263478f9822793644668ae733302b871",
    tokenMessage: "Save this token securely. It will not be shown again.",
    isOpen: true,
    onCopy: () => {},
    onClose: () => {},
  },
} satisfies Meta<typeof HostTokenDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const WithoutToken: Story = {
  args: {
    token: null,
    tokenMessage: null,
  },
};

export const LongToken: Story = {
  args: {
    token: "obsern_host_token_66e5f2d4e68b42c9bf3d9f6bc2a03d1f96b4386ecaf3415984db1513c1586db9e997322cf0ef4b7",
  },
};
