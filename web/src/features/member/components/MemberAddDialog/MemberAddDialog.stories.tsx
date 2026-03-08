import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemberAddDialog } from "@/features/member/components/MemberAddDialog/MemberAddDialog";
import { MembershipRole } from "@/generated/api";

const roleOptions = [
  { id: MembershipRole.owner, name: "OWNER" },
  { id: MembershipRole.editor, name: "EDITOR" },
  { id: MembershipRole.viewer, name: "VIEWER" },
] as const;

const meta = {
  title: "Features/Member/MemberAddDialog",
  component: MemberAddDialog,
  args: {
    title: "Add member",
    description: "workspace-6876ae4f",
    userIdLabel: "User ID",
    roleLabel: "Role",
    addLabel: "Add",
    cancelLabel: "Cancel",
    draftUserId: "ee5d9ac6-0930-441c-9f05-61c0427ad261",
    draftRole: MembershipRole.viewer,
    roleOptions,
    isSubmitting: false,
    isOpen: true,
    onClose: () => {},
    onDraftUserIdChange: () => {},
    onDraftRoleChange: () => {},
    onSubmit: () => {},
  },
} satisfies Meta<typeof MemberAddDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};
