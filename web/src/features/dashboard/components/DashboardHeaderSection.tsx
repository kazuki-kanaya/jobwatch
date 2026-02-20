import { Fingerprint, LogOut, PenLine, RefreshCw, SquareTerminal, UserRound } from "lucide-react";
import LocaleSelect from "@/components/LocaleSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DashboardProfileEditDialog from "@/features/dashboard/components/DashboardProfileEditDialog";
import type { DashboardSelectOption } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type DashboardHeaderSectionProps = {
  title: string;
  subtitle: string;
  updatedAt: string;
  missionControlLabel: string;
  currentUserLabel: string;
  currentUserId: string;
  currentUserName: string;
  updatedAtLabel: string;
  refreshLabel: string;
  signOutLabel: string;
  localeLabel: string;
  profileEditLabel: string;
  profileNameLabel: string;
  updateLabel: string;
  cancelLabel: string;
  localeOptions: DashboardSelectOption[];
  localeValue: string;
  isRefreshing: boolean;
  isProfileDialogOpen: boolean;
  profileDraftName: string;
  isProfileSubmitting: boolean;
  onLocaleChange: (locale: string) => void;
  onRefresh: () => void;
  onSignOut: () => void;
  onOpenProfileDialog: () => void;
  onCloseProfileDialog: () => void;
  onProfileDraftNameChange: (value: string) => void;
  onSubmitProfile: () => void;
};

export default function DashboardHeaderSection({
  title,
  updatedAt,
  missionControlLabel,
  currentUserLabel,
  currentUserId,
  currentUserName,
  updatedAtLabel,
  refreshLabel,
  signOutLabel,
  localeLabel,
  profileEditLabel,
  profileNameLabel,
  updateLabel,
  cancelLabel,
  localeOptions,
  localeValue,
  isRefreshing,
  isProfileDialogOpen,
  profileDraftName,
  isProfileSubmitting,
  onLocaleChange,
  onRefresh,
  onSignOut,
  onOpenProfileDialog,
  onCloseProfileDialog,
  onProfileDraftNameChange,
  onSubmitProfile,
}: DashboardHeaderSectionProps) {
  return (
    <Card className={cn("border-slate-700/60 bg-slate-900/80 py-4 backdrop-blur")}>
      <CardContent className={cn("flex flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between")}>
        <div className={cn("space-y-1")}>
          <p className={cn("font-mono text-sm tracking-[0.2em] text-cyan-300 uppercase")}>{missionControlLabel}</p>
          <div className={cn("flex items-center gap-3")}>
            <span
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-md border border-cyan-300/40 bg-cyan-500/10 text-cyan-300",
              )}
            >
              <SquareTerminal className={cn("size-4.5")} />
            </span>
            <h1 className={cn("text-3xl font-semibold text-slate-100 md:text-4xl")}>{title}</h1>
          </div>
          <p className={cn("font-mono text-sm text-slate-500")}>
            {updatedAtLabel}: {updatedAt} JST
          </p>
        </div>
        <div className={cn("flex flex-col items-start gap-2 md:items-end")}>
          <div
            className={cn(
              "w-full max-w-[360px] rounded-md border border-cyan-300/35 bg-cyan-500/10 px-3 py-2",
              "shadow-[inset_0_0_0_1px_rgba(34,211,238,0.12)]",
            )}
          >
            <div className={cn("mb-1 flex items-center justify-between gap-2")}>
              <span className={cn("text-xs font-semibold tracking-wide text-cyan-100 uppercase")}>
                {currentUserLabel}
              </span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={onOpenProfileDialog}
                className={cn("h-6 px-2 text-xs text-cyan-100 hover:bg-cyan-500/20 hover:text-cyan-50")}
              >
                <PenLine className={cn("size-3.5")} />
                {profileEditLabel}
              </Button>
            </div>
            <div className={cn("flex flex-col gap-2.5")}>
              <div className={cn("flex items-center gap-1.5 text-base text-slate-50")}>
                <UserRound className={cn("size-4 text-cyan-200")} />
                <span className={cn("font-semibold leading-none")}>{currentUserName}</span>
              </div>
              <div className={cn("flex items-center gap-1.5 font-mono text-xs text-slate-300")}>
                <Fingerprint className={cn("size-3.5 text-slate-300")} />
                <span className={cn("leading-none")}>{currentUserId}</span>
              </div>
            </div>
          </div>
          <div className={cn("flex flex-wrap items-center gap-2")}>
            <div className={cn("space-y-1")}>
              <span className={cn("sr-only")}>{localeLabel}</span>
              <LocaleSelect
                id="dashboard-language"
                label={localeLabel}
                options={localeOptions}
                value={localeValue}
                onChange={onLocaleChange}
                triggerClassName={cn("min-w-32")}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={onRefresh}
              disabled={isRefreshing}
              className={cn("border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
            >
              <RefreshCw className={cn("size-4", isRefreshing ? "animate-spin" : "")} />
              {refreshLabel}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onSignOut}
              className={cn("bg-rose-700 text-white hover:bg-rose-600")}
            >
              <LogOut className={cn("size-4")} />
              {signOutLabel}
            </Button>
          </div>
        </div>
      </CardContent>
      <DashboardProfileEditDialog
        title={profileEditLabel}
        nameLabel={profileNameLabel}
        updateLabel={updateLabel}
        cancelLabel={cancelLabel}
        isOpen={isProfileDialogOpen}
        draftName={profileDraftName}
        isSubmitting={isProfileSubmitting}
        onClose={onCloseProfileDialog}
        onDraftNameChange={onProfileDraftNameChange}
        onSubmit={onSubmitProfile}
      />
    </Card>
  );
}
