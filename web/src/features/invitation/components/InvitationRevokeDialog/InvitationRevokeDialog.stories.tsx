import type { Meta, StoryObj } from "@storybook/react-vite";
import { InvitationRevokeDialog } from "@/features/invitation/components/InvitationRevokeDialog/InvitationRevokeDialog";

const meta = {
  title: "Features/Invitation/InvitationRevokeDialog",
  component: InvitationRevokeDialog,
  args: {
    title: "Revoke invitation?",
    description: "This invitation URL will no longer be valid.",
    cancelLabel: "Cancel",
    confirmLabel: "Revoke",
    isSubmitting: false,
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
  },
} satisfies Meta<typeof InvitationRevokeDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};
