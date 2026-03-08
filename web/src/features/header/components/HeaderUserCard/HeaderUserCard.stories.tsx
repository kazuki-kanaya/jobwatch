import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeaderUserCard } from "@/features/header/components/HeaderUserCard/HeaderUserCard";

const meta = {
  title: "Features/Header/HeaderUserCard",
  component: HeaderUserCard,
  args: {
    currentUserLabel: "Signed-in user",
    currentUserName: "no name",
    currentUserId: "ee5d9ac6-0930-441c-9f05-61c0427ad261",
    editProfileLabel: "Edit name",
    onEditProfile: () => {},
  },
} satisfies Meta<typeof HeaderUserCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Japanese: Story = {
  args: {
    currentUserLabel: "ログイン中のユーザー",
    editProfileLabel: "名前を変更",
  },
};

export const LongName: Story = {
  args: {
    currentUserName: "kazu-platform-admin-supervisor",
  },
};
