import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemberDeleteDialog } from "@/features/member/components/MemberDeleteDialog/MemberDeleteDialog";

const meta = {
  title: "Features/Member/MemberDeleteDialog",
  component: MemberDeleteDialog,
  args: {
    title: "Delete member?",
    description: "This action cannot be undone.",
    cancelLabel: "Cancel",
    confirmLabel: "Delete",
    isSubmitting: false,
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
  },
} satisfies Meta<typeof MemberDeleteDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};
