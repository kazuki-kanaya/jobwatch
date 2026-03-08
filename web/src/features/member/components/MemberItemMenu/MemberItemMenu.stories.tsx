import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemberItemMenu } from "@/features/member/components/MemberItemMenu/MemberItemMenu";

const meta = {
  title: "Features/Member/MemberItemMenu",
  component: MemberItemMenu,
  args: {
    userId: "ee5d9ac6-0930-441c-9f05-61c0427ad261",
    canManage: true,
    editLabel: "Edit role",
    deleteLabel: "Remove",
    onEditMember: () => {},
    onDeleteMember: () => {},
  },
} satisfies Meta<typeof MemberItemMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Disabled: Story = {
  args: {
    canManage: false,
  },
};
