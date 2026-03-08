import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemberItem } from "@/features/member/components/MemberItem/MemberItem";
import { MembershipRole } from "@/generated/api";

const meta = {
  title: "Features/Member/MemberItem",
  component: MemberItem,
  args: {
    member: {
      userId: "ee5d9ac6-0930-441c-9f05-61c0427ad261",
      userName: "name A",
      role: MembershipRole.owner,
    },
    canManage: true,
    userIdLabel: "User ID",
    roleLabel: "Role",
    editLabel: "Edit role",
    deleteLabel: "Remove",
    onEditMember: () => {},
    onDeleteMember: () => {},
  },
} satisfies Meta<typeof MemberItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const ReadOnly: Story = {
  args: {
    canManage: false,
  },
};
