import type { Meta, StoryObj } from "@storybook/react-vite";
import InvitationAcceptView from "@/features/invitations/views/InvitationAcceptView";

const meta = {
  title: "Features/Invitations/InvitationAcceptView",
  component: InvitationAcceptView,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
  args: {
    title: "Join workspace",
    subtitle: "Accept this invitation to access the shared project.",
    tokenMissingLabel: "Invitation token is missing.",
    tokenMissingHelp: "Open the invitation URL from your email or chat message.",
    acceptLabel: "Accept invitation",
    acceptingLabel: "Accepting...",
    successLabel: "Invitation accepted",
    successHelp: "You now have access. Continue to dashboard.",
    errorLabel: "Could not accept invitation",
    retryLabel: "Try again",
    backToDashboardLabel: "Back to dashboard",
    isTokenMissing: false,
    isPending: false,
    isSuccess: false,
    errorMessage: null,
    onAccept: () => {},
    onGoDashboard: () => {},
  },
} satisfies Meta<typeof InvitationAcceptView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MissingToken: Story = {
  args: {
    isTokenMissing: true,
  },
};

export const Accepted: Story = {
  args: {
    isSuccess: true,
  },
};
