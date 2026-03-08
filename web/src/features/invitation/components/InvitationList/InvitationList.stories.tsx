import type { Meta, StoryObj } from "@storybook/react-vite";
import { InvitationList } from "@/features/invitation/components/InvitationList/InvitationList";
import { MembershipRole } from "@/generated/api";

const items = [
  {
    invitationId: "inv-56e9a633b9",
    role: MembershipRole.editor,
    createdByName: "name A",
    createdByUserId: "ee5d9ac6-0930-441c-9f05-61c0427ad261",
    expiresAt: "2026/03/15 13:53 UTC",
    status: "active" as const,
  },
  {
    invitationId: "inv-7addc7ea47",
    role: MembershipRole.owner,
    createdByName: "name A",
    createdByUserId: "ee5d9ac6-0930-441c-9f05-61c0427ad261",
    expiresAt: "2026/03/14 13:53 UTC",
    status: "used" as const,
  },
];

const meta = {
  title: "Features/Invitation/InvitationList",
  component: InvitationList,
  args: {
    items,
    isLoading: false,
    isError: false,
    isForbidden: false,
    emptyLabel: "No invitations yet.",
    forbiddenLabel: "You do not have permission for this action.",
    errorLabel: "Failed to load invitations.",
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
} satisfies Meta<typeof InvitationList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const ErrorState: Story = {
  args: {
    isError: true,
  },
};

export const Forbidden: Story = {
  args: {
    isForbidden: true,
    canManage: false,
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};
