import { Loader2, ShieldCheck, TriangleAlert, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type InvitationAcceptViewProps = {
  title: string;
  subtitle: string;
  tokenMissingLabel: string;
  tokenMissingHelp: string;
  acceptLabel: string;
  acceptingLabel: string;
  successLabel: string;
  successHelp: string;
  errorLabel: string;
  retryLabel: string;
  backToDashboardLabel: string;
  isTokenMissing: boolean;
  isPending: boolean;
  isSuccess: boolean;
  errorMessage: string | null;
  onAccept: () => void;
  onGoDashboard: () => void;
};

export default function InvitationAcceptView({
  title,
  subtitle,
  tokenMissingLabel,
  tokenMissingHelp,
  acceptLabel,
  acceptingLabel,
  successLabel,
  successHelp,
  errorLabel,
  retryLabel,
  backToDashboardLabel,
  isTokenMissing,
  isPending,
  isSuccess,
  errorMessage,
  onAccept,
  onGoDashboard,
}: InvitationAcceptViewProps) {
  const ctaLabel = isPending ? acceptingLabel : errorMessage ? retryLabel : acceptLabel;

  return (
    <main
      className={cn(
        "min-h-screen bg-[radial-gradient(circle_at_15%_15%,rgba(14,165,233,0.18),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(251,191,36,0.16),transparent_34%),#020617] px-4 py-8 md:px-8",
      )}
    >
      <div className={cn("mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center")}>
        <Card className={cn("w-full border-slate-700/60 bg-slate-900/80 text-slate-100")}>
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2 text-xl")}>
              <UserPlus className={cn("size-5 text-cyan-300")} />
              {title}
            </CardTitle>
            <CardDescription className={cn("text-slate-300")}>{subtitle}</CardDescription>
          </CardHeader>
          <CardContent className={cn("space-y-4")}>
            {isTokenMissing ? (
              <div className={cn("rounded-md border border-amber-300/40 bg-amber-500/10 p-4")}>
                <p className={cn("font-medium text-amber-200")}>{tokenMissingLabel}</p>
                <p className={cn("mt-1 text-sm text-amber-100/90")}>{tokenMissingHelp}</p>
              </div>
            ) : null}

            {isSuccess ? (
              <div className={cn("rounded-md border border-emerald-300/40 bg-emerald-500/10 p-4")}>
                <p className={cn("flex items-center gap-2 font-medium text-emerald-200")}>
                  <ShieldCheck className={cn("size-4")} />
                  {successLabel}
                </p>
                <p className={cn("mt-1 text-sm text-emerald-100/90")}>{successHelp}</p>
              </div>
            ) : null}

            {errorMessage ? (
              <div className={cn("rounded-md border border-rose-400/40 bg-rose-950/40 p-4")}>
                <p className={cn("flex items-center gap-2 font-medium text-rose-200")}>
                  <TriangleAlert className={cn("size-4")} />
                  {errorLabel}
                </p>
                <p className={cn("mt-1 text-sm text-rose-100/90")}>{errorMessage}</p>
              </div>
            ) : null}
          </CardContent>
          <CardFooter className={cn("flex flex-wrap justify-end gap-2")}>
            <Button
              type="button"
              variant="outline"
              onClick={onGoDashboard}
              className={cn("border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
            >
              {backToDashboardLabel}
            </Button>
            <Button
              type="button"
              onClick={onAccept}
              disabled={isTokenMissing || isPending || isSuccess}
              className={cn("bg-cyan-500 text-slate-950 hover:bg-cyan-400")}
            >
              {isPending ? <Loader2 className={cn("size-4 animate-spin")} /> : null}
              {ctaLabel}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
