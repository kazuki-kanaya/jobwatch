import type { Meta, StoryObj } from "@storybook/react-vite";
import { InvitationItemMenu } from "@/features/invitation/components/InvitationItemMenu/InvitationItemMenu";

const meta = {
  title: "Features/Invitation/InvitationItemMenu",
  component: InvitationItemMenu,
  args: {
    invitationId: "inv-56e9a633b9",
    canManage: true,
    revokeLabel: "Revoke",
    onRevoke: () => {},
  },
} satisfies Meta<typeof InvitationItemMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Disabled: Story = {
  args: {
    canManage: false,
  },
};
