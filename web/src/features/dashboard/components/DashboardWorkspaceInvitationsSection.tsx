import { Fingerprint } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardInvitationItem } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type InvitationStatus = "active" | "used" | "expired";

type DashboardWorkspaceInvitationsSectionProps = {
  title: string;
  workspaceLabel: string;
  workspaceName: string;
  roleLabel: string;
  createdByLabel: string;
  expiresAtLabel: string;
  usedAtLabel: string;
  statusActiveLabel: string;
  statusUsedLabel: string;
  statusExpiredLabel: string;
  revokeConfirmTitle: string;
  revokeConfirmDescription: string;
  revokeLabel: string;
  cancelLabel: string;
  emptyLabel: string;
  errorLabel: string;
  canManage: boolean;
  noPermissionLabel: string;
  invitations: DashboardInvitationItem[];
  isLoading: boolean;
  isError: boolean;
  isForbidden: boolean;
  isSubmitting: boolean;
  pendingRevokeInvitationId: string | null;
  onRequestRevoke: (invitationId: string) => void;
  onCancelRevoke: () => void;
  onConfirmRevoke: () => void;
};

export default function DashboardWorkspaceInvitationsSection({
  title,
  workspaceLabel,
  workspaceName,
  roleLabel,
  createdByLabel,
  expiresAtLabel,
  usedAtLabel,
  statusActiveLabel,
  statusUsedLabel,
  statusExpiredLabel,
  revokeConfirmTitle,
  revokeConfirmDescription,
  revokeLabel,
  cancelLabel,
  emptyLabel,
  errorLabel,
  canManage,
  noPermissionLabel,
  invitations,
  isLoading,
  isError,
  isForbidden,
  isSubmitting,
  pendingRevokeInvitationId,
  onRequestRevoke,
  onCancelRevoke,
  onConfirmRevoke,
}: DashboardWorkspaceInvitationsSectionProps) {
  const getInvitationStatus = (invitation: DashboardInvitationItem): InvitationStatus => {
    if (invitation.usedAt) return "used";

    const expiresAt = new Date(invitation.expiresAtIso);
    if (Number.isNaN(expiresAt.getTime())) return "active";

    return expiresAt.getTime() < Date.now() ? "expired" : "active";
  };

  const getStatusLabel = (status: InvitationStatus): string => {
    if (status === "used") return statusUsedLabel;
    if (status === "expired") return statusExpiredLabel;
    return statusActiveLabel;
  };

  const getStatusClassName = (status: InvitationStatus): string => {
    if (status === "used") return "border-teal-400/40 bg-teal-500/10 text-teal-200";
    if (status === "expired") return "border-rose-400/40 bg-rose-500/10 text-rose-200";
    return "border-emerald-400/40 bg-emerald-500/10 text-emerald-200";
  };

  return (
    <section className={cn("space-y-2 rounded-md border border-slate-700/70 bg-slate-800/40 p-3")}>
      <div className={cn("flex flex-wrap items-center justify-between gap-2")}>
        <p className={cn("text-xs font-semibold text-slate-300")}>{title}</p>
        <p className={cn("text-xs text-slate-400")}>
          {workspaceLabel}: <span className={cn("font-semibold text-slate-200")}>{workspaceName}</span>
        </p>
      </div>
      {isLoading ? (
        <div className={cn("space-y-2")}>
          <Skeleton className={cn("h-14 bg-slate-800")} />
          <Skeleton className={cn("h-14 bg-slate-800")} />
        </div>
      ) : null}
      {!isLoading && isForbidden ? <p className={cn("text-sm text-amber-200")}>{noPermissionLabel}</p> : null}
      {!isLoading && !isForbidden && isError ? <p className={cn("text-sm text-rose-300")}>{errorLabel}</p> : null}
      {!isLoading && !isForbidden && !isError && invitations.length === 0 ? (
        <p className={cn("text-sm text-slate-400")}>{emptyLabel}</p>
      ) : null}
      {!isLoading && !isForbidden && !isError
        ? invitations.map((invitation) => (
            <article
              key={invitation.id}
              className={cn("space-y-2 rounded-md border border-slate-700 bg-slate-900/70 p-3")}
            >
              <div className={cn("flex items-center justify-between gap-2")}>
                <p
                  className={cn(
                    "rounded border border-slate-700 bg-slate-950/70 px-2 py-1 font-mono text-[11px] text-slate-300",
                  )}
                >
                  {invitation.id}
                </p>
                <Badge className={cn(getStatusClassName(getInvitationStatus(invitation)))} variant="outline">
                  {getStatusLabel(getInvitationStatus(invitation))}
                </Badge>
              </div>
              <dl className={cn("space-y-1.5 rounded border border-slate-800/80 bg-slate-950/40 p-2.5")}>
                <div className={cn("flex items-start gap-3")}>
                  <dt className={cn("min-w-28 text-[11px] font-semibold uppercase tracking-wide text-slate-400")}>
                    {roleLabel}
                  </dt>
                  <dd className={cn("text-sm font-semibold text-slate-100")}>{invitation.role}</dd>
                </div>
                <div className={cn("flex items-start gap-3")}>
                  <dt className={cn("min-w-28 text-[11px] font-semibold uppercase tracking-wide text-slate-400")}>
                    {createdByLabel}
                  </dt>
                  <dd className={cn("flex flex-wrap items-center gap-2")}>
                    <span className={cn("text-sm text-slate-100")}>{invitation.createdBy}</span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border border-slate-600 bg-slate-900/50 px-2 py-1 font-mono text-xs text-slate-300",
                      )}
                    >
                      <Fingerprint className={cn("size-3.5 text-slate-400")} />
                      <span className={cn("break-all")}>{invitation.createdByUserId}</span>
                    </span>
                  </dd>
                </div>
                <div className={cn("flex items-start gap-3")}>
                  <dt className={cn("min-w-28 text-[11px] font-semibold uppercase tracking-wide text-slate-400")}>
                    {expiresAtLabel}
                  </dt>
                  <dd className={cn("text-sm font-medium text-cyan-200")}>{invitation.expiresAt}</dd>
                </div>
                <div className={cn("flex items-start gap-3")}>
                  <dt className={cn("min-w-28 text-[11px] font-semibold uppercase tracking-wide text-slate-400")}>
                    {usedAtLabel}
                  </dt>
                  <dd className={cn("text-sm text-slate-100")}>{invitation.usedAt ?? "-"}</dd>
                </div>
              </dl>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!canManage}
                title={!canManage ? noPermissionLabel : undefined}
                onClick={() => onRequestRevoke(invitation.id)}
                className={cn("mt-2 border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
              >
                {revokeLabel}
              </Button>
            </article>
          ))
        : null}
      <AlertDialog open={Boolean(pendingRevokeInvitationId)} onOpenChange={(open) => (!open ? onCancelRevoke() : null)}>
        <AlertDialogContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
          <AlertDialogHeader>
            <AlertDialogTitle>{revokeConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription className={cn("text-slate-300")}>{revokeConfirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={onCancelRevoke}
              className={cn("border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700")}
            >
              {cancelLabel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmRevoke}
              disabled={isSubmitting}
              className={cn("bg-rose-600 text-white hover:bg-rose-500")}
            >
              {revokeLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
