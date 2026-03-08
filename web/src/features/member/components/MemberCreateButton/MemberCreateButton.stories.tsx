import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemberCreateButton } from "@/features/member/components/MemberCreateButton/MemberCreateButton";

const meta = {
  title: "Features/Member/MemberCreateButton",
  component: MemberCreateButton,
  args: {
    addLabel: "Add",
    noPermissionLabel: "No permission",
    canCreate: true,
    onCreateMember: () => {},
  },
} satisfies Meta<typeof MemberCreateButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Disabled: Story = {
  args: {
    canCreate: false,
  },
};
