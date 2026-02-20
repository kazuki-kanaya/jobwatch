import type { Meta, StoryObj } from "@storybook/react-vite";
import DashboardMembersSection from "@/features/dashboard/components/DashboardMembersSection";

const meta = {
  title: "Features/Dashboard/DashboardMembersSection",
  component: DashboardMembersSection,
  parameters: {
    layout: "padded",
    backgrounds: { default: "dark" },
  },
  args: {
    title: "Members",
    userIdLabel: "User ID",
    usernameLabel: "Username",
    roleLabel: "Role",
    invitationLinkLabel: "Invitation link",
    invitationLinkPlaceholder: "Generate a link to invite members.",
    generateInviteLabel: "Generate invite",
    copyLinkLabel: "Copy link",
    addLabel: "Add",
    editLabel: "Edit",
    updateLabel: "Update",
    cancelLabel: "Cancel",
    deleteLabel: "Delete",
    emptyLabel: "No members yet.",
    errorLabel: "Failed to load members.",
    noPermissionLabel: "You do not have permission for this action.",
    canManage: true,
    deleteConfirmTitle: "Remove member?",
    deleteConfirmDescription: "The user will lose access to this workspace.",
    members: [
      { userId: "user-001", userName: "kazu", role: "owner" },
      { userId: "user-002", userName: "alice", role: "editor" },
    ],
    roleOptions: [
      { id: "owner", name: "owner" },
      { id: "editor", name: "editor" },
      { id: "viewer", name: "viewer" },
    ],
    draftUserId: "user-003",
    draftRole: "viewer",
    inviteRole: "viewer",
    editingUserId: null,
    editingRole: "viewer",
    invitationUrl: null,
    isLoading: false,
    isError: false,
    isSubmitting: false,
    isAddDialogOpen: false,
    isInviteDialogOpen: false,
    isEditDialogOpen: false,
    pendingDeleteUserId: null,
    onOpenAddDialog: () => {},
    onCloseAddDialog: () => {},
    onOpenInviteDialog: () => {},
    onCloseInviteDialog: () => {},
    onDraftUserIdChange: () => {},
    onDraftRoleChange: () => {},
    onInviteRoleChange: () => {},
    onEditingRoleChange: () => {},
    onSubmitAdd: () => {},
    onGenerateInvite: () => {},
    onCopyInvitationLink: () => {},
    onRequestEdit: () => {},
    onCloseEditDialog: () => {},
    onSubmitRoleUpdate: () => {},
    onRequestDelete: () => {},
    onCancelDelete: () => {},
    onConfirmDelete: () => {},
  },
} satisfies Meta<typeof DashboardMembersSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { members: [] },
};

export const Loading: Story = {
  args: { isLoading: true, members: [] },
};

export const InviteReady: Story = {
  args: {
    isInviteDialogOpen: true,
    invitationUrl: "https://jobwatch.example/invite?token=sample-token",
  },
};

export const EditRoleOpen: Story = {
  args: {
    isEditDialogOpen: true,
    editingUserId: "user-002",
    editingRole: "editor",
  },
};

export const ReadOnly: Story = {
  args: {
    canManage: false,
  },
};
