import type { Meta, StoryObj } from "@storybook/react-vite";
import { InvitationList } from "@/features/invitation/components/InvitationList/InvitationList";
import { InvitationManagementSection } from "@/features/invitation/components/InvitationManagementSection/InvitationManagementSection";

const meta = {
  title: "Features/Invitation/InvitationManagementSection",
  component: InvitationManagementSection,
  args: {
    title: "Invitations",
    list: (
      <InvitationList
        items={[]}
        isLoading={false}
        isError={false}
        isForbidden={false}
        emptyLabel="No invitations yet."
        forbiddenLabel="You do not have permission for this action."
        errorLabel="Failed to load invitations."
        canManage={true}
        labels={{
          createdBy: "Created by",
          expiresAt: "Expires at",
          active: "Active",
          used: "Used",
          expired: "Expired",
          revoke: "Revoke",
        }}
        onRevoke={() => {}}
      />
    ),
    dialogs: null,
  },
} satisfies Meta<typeof InvitationManagementSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
