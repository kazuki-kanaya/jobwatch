import type { Meta, StoryObj } from "@storybook/react-vite";
import { InvitationAccept } from "@/features/invitation/components/InvitationAccept/InvitationAccept";

const meta = {
  title: "Features/Invitation/InvitationAccept",
  component: InvitationAccept,
  args: {
    title: "Join workspace",
    subtitle: "Accept the invitation link to access this workspace.",
    tokenMissingLabel: "Invitation token is missing.",
    tokenMissingHelp: "Open the full invitation URL with a valid token.",
    acceptLabel: "Accept invitation",
    acceptingLabel: "Accepting...",
    successLabel: "Invitation accepted",
    successHelp: "You can now access this workspace from your dashboard.",
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
} satisfies Meta<typeof InvitationAccept>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const TokenMissing: Story = {
  args: {
    isTokenMissing: true,
  },
};

export const Success: Story = {
  args: {
    isSuccess: true,
  },
};

export const ErrorState: Story = {
  args: {
    errorMessage: "Invitation acceptance failed. Please request a new link.",
  },
};
