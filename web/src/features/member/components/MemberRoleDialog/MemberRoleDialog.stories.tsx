import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemberRoleDialog } from "@/features/member/components/MemberRoleDialog/MemberRoleDialog";
import { MembershipRole } from "@/generated/api";

const roleOptions = [
  { id: MembershipRole.owner, name: "OWNER" },
  { id: MembershipRole.editor, name: "EDITOR" },
  { id: MembershipRole.viewer, name: "VIEWER" },
] as const;

const meta = {
  title: "Features/Member/MemberRoleDialog",
  component: MemberRoleDialog,
  args: {
    title: "Edit member role",
    description: "workspace-6876ae4f",
    userIdLabel: "User ID",
    roleLabel: "Role",
    updateLabel: "Update",
    cancelLabel: "Cancel",
    editingUserId: "ee5d9ac6-0930-441c-9f05-61c0427ad261",
    editingRole: MembershipRole.editor,
    roleOptions,
    isSubmitting: false,
    isOpen: true,
    onClose: () => {},
    onEditingRoleChange: () => {},
    onSubmit: () => {},
  },
} satisfies Meta<typeof MemberRoleDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};
