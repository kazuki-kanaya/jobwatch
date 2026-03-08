import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemberCreateEntryDialog } from "@/features/member/components/MemberCreateEntryDialog/MemberCreateEntryDialog";

const meta = {
  title: "Features/Member/MemberCreateEntryDialog",
  component: MemberCreateEntryDialog,
  args: {
    title: "Add member",
    description: "workspace-6876ae4f",
    addByUserIdLabel: "Add by user ID",
    addByInvitationLabel: "Create invitation link",
    cancelLabel: "Cancel",
    isOpen: true,
    onClose: () => {},
    onSelectUserId: () => {},
    onSelectInvitation: () => {},
  },
} satisfies Meta<typeof MemberCreateEntryDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
