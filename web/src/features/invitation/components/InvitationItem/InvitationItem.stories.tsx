import type { Meta, StoryObj } from "@storybook/react-vite";
import { InvitationItem } from "@/features/invitation/components/InvitationItem/InvitationItem";
import { MembershipRole } from "@/generated/api";

const meta = {
  title: "Features/Invitation/InvitationItem",
  component: InvitationItem,
  args: {
    item: {
      invitationId: "inv-56e9a633b9",
      role: MembershipRole.editor,
      createdByName: "name A",
      createdByUserId: "ee5d9ac6-0930-441c-9f05-61c0427ad261",
      expiresAt: "2026/03/15 13:53 UTC",
      status: "active",
    },
    canManage: true,
    labels: {
      createdBy: "Created by",
      expiresAt: "Expires at",
      active: "Active",
      used: "Used",
      expired: "Expired",
      revoke: "Revoke",
    },
    onRevoke: () => {},
  },
} satisfies Meta<typeof InvitationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {};

export const Used: Story = {
  args: {
    item: {
      invitationId: "inv-7addc7ea47",
      role: MembershipRole.owner,
      createdByName: "name A",
      createdByUserId: "ee5d9ac6-0930-441c-9f05-61c0427ad261",
      expiresAt: "2026/03/15 13:53 UTC",
      status: "used",
    },
  },
};

export const ExpiredReadOnly: Story = {
  args: {
    canManage: false,
    item: {
      invitationId: "inv-591ae1eda3",
      role: MembershipRole.viewer,
      createdByName: "name A",
      createdByUserId: "ee5d9ac6-0930-441c-9f05-61c0427ad261",
      expiresAt: "2026/03/01 13:53 UTC",
      status: "expired",
    },
  },
};
