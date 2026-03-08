import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemberList } from "@/features/member/components/MemberList/MemberList";
import { MembershipRole } from "@/generated/api";

const items = [
  {
    userId: "ee5d9ac6-0930-441c-9f05-61c0427ad261",
    userName: "name A",
    role: MembershipRole.owner,
  },
  {
    userId: "f3a5b7cd-8b41-4f57-9f44-6426b18f55d0",
    userName: "name B",
    role: MembershipRole.viewer,
  },
];

const meta = {
  title: "Features/Member/MemberList",
  component: MemberList,
  args: {
    items,
    isLoading: false,
    isError: false,
    emptyLabel: "No members yet.",
    errorLabel: "Failed to load members.",
    userIdLabel: "User ID",
    roleLabel: "Role",
    editLabel: "Edit role",
    deleteLabel: "Remove",
    canManage: true,
    onEditMember: () => {},
    onDeleteMember: () => {},
  },
} satisfies Meta<typeof MemberList>;

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

export const Empty: Story = {
  args: {
    items: [],
  },
};
