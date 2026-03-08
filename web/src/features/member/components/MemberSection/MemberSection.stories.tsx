import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemberCreateButton } from "@/features/member/components/MemberCreateButton/MemberCreateButton";
import { MemberList } from "@/features/member/components/MemberList/MemberList";
import { MemberSection } from "@/features/member/components/MemberSection/MemberSection";
import { MembershipRole } from "@/generated/api";

const items = [
  {
    userId: "ee5d9ac6-0930-441c-9f05-61c0427ad261",
    userName: "name A",
    role: MembershipRole.owner,
  },
];

const meta = {
  title: "Features/Member/MemberSection",
  component: MemberSection,
  args: {
    title: "Members",
    headerActions: (
      <MemberCreateButton addLabel="Add" noPermissionLabel="No permission" canCreate={true} onCreateMember={() => {}} />
    ),
    content: (
      <MemberList
        items={items}
        isLoading={false}
        isError={false}
        emptyLabel="No members yet."
        errorLabel="Failed to load members."
        userIdLabel="User ID"
        roleLabel="Role"
        editLabel="Edit role"
        deleteLabel="Remove"
        canManage={true}
        onEditMember={() => {}}
        onDeleteMember={() => {}}
      />
    ),
    dialogs: null,
  },
} satisfies Meta<typeof MemberSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
