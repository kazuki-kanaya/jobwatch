import type { Meta, StoryObj } from "@storybook/react-vite";
import { InvitationCreateDialog } from "@/features/invitation/components/InvitationCreateDialog/InvitationCreateDialog";
import { MembershipRole } from "@/generated/api";

const roleOptions = [
  { id: MembershipRole.owner, name: "OWNER" },
  { id: MembershipRole.editor, name: "EDITOR" },
  { id: MembershipRole.viewer, name: "VIEWER" },
] as const;

const meta = {
  title: "Features/Invitation/InvitationCreateDialog",
  component: InvitationCreateDialog,
  args: {
    title: "Create invitation link",
    description: "workspace-6876ae4f",
    roleLabel: "Role",
    generateLabel: "Generate invite",
    invitationLinkLabel: "Invitation link",
    invitationLinkPlaceholder: "Generate a link to invite members.",
    copyLabel: "Copy link",
    cancelLabel: "Cancel",
    draftRole: MembershipRole.viewer,
    roleOptions,
    invitationUrl: null,
    isSubmitting: false,
    isOpen: true,
    onClose: () => {},
    onDraftRoleChange: () => {},
    onGenerate: () => {},
    onCopy: () => {},
  },
} satisfies Meta<typeof InvitationCreateDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithLink: Story = {
  args: {
    invitationUrl: "http://localhost:5173/invite?token=sample-token",
  },
};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};
