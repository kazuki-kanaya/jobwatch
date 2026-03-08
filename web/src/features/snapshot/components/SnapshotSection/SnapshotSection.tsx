import { Activity, CheckCircle2, CircleAlert, TimerReset } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SnapshotMetrics, SnapshotViewState } from "@/features/snapshot/components/types";
import { cn } from "@/lib/utils";

type SnapshotSectionProps = {
  snapshot: SnapshotMetrics;
  state: SnapshotViewState;
  errorLabel: string;
  labels: {
    tracked: string;
    running: string;
    completed: string;
    failed: string;
  };
};

export function SnapshotSection({ snapshot, state, errorLabel, labels }: SnapshotSectionProps) {
  if (state === "error") {
    return (
      <p className={cn("rounded-xl border border-rose-400/35 bg-rose-950/35 px-4 py-3 text-sm text-rose-100")}>
        {errorLabel}
      </p>
    );
  }

  if (state === "loading") {
    return (
      <section className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-4")}>
        <Card className={cn("border-slate-700/60 bg-slate-900/80 py-4")}>
          <CardContent className={cn("space-y-2 px-4")}>
            <Skeleton className={cn("h-4 w-20 bg-slate-700")} />
            <Skeleton className={cn("h-8 w-12 bg-slate-700")} />
          </CardContent>
        </Card>
        <Card className={cn("border-cyan-400/35 bg-cyan-500/10 py-4")}>
          <CardContent className={cn("space-y-2 px-4")}>
            <Skeleton className={cn("h-4 w-16 bg-cyan-900/70")} />
            <Skeleton className={cn("h-8 w-12 bg-cyan-900/70")} />
          </CardContent>
        </Card>
        <Card className={cn("border-emerald-400/35 bg-emerald-500/10 py-4")}>
          <CardContent className={cn("space-y-2 px-4")}>
            <Skeleton className={cn("h-4 w-16 bg-emerald-900/70")} />
            <Skeleton className={cn("h-8 w-12 bg-emerald-900/70")} />
          </CardContent>
        </Card>
        <Card className={cn("border-rose-400/35 bg-rose-500/10 py-4")}>
          <CardContent className={cn("space-y-2 px-4")}>
            <Skeleton className={cn("h-4 w-16 bg-rose-900/70")} />
            <Skeleton className={cn("h-8 w-12 bg-rose-900/70")} />
          </CardContent>
        </Card>
      </section>
    );
  }

  const cards = [
    {
      key: "tracked",
      value: snapshot.tracked,
      label: labels.tracked,
      icon: Activity,
      iconClassName: "text-slate-100",
      cardClassName: "border-slate-700/60 bg-slate-900/80",
      labelClassName: "text-slate-300",
    },
    {
      key: "running",
      value: snapshot.running,
      label: labels.running,
      icon: TimerReset,
      iconClassName: "text-cyan-200",
      cardClassName: "border-cyan-400/35 bg-cyan-500/10",
      labelClassName: "text-cyan-100",
    },
    {
      key: "completed",
      value: snapshot.completed,
      label: labels.completed,
      icon: CheckCircle2,
      iconClassName: "text-emerald-200",
      cardClassName: "border-emerald-400/35 bg-emerald-500/10",
      labelClassName: "text-emerald-100",
    },
    {
      key: "failed",
      value: snapshot.failed,
      label: labels.failed,
      icon: CircleAlert,
      iconClassName: "text-rose-200",
      cardClassName: "border-rose-400/35 bg-rose-500/10",
      labelClassName: "text-rose-100",
    },
  ] as const;

  return (
    <section className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-4")}>
      {cards.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.key} className={cn("py-4", item.cardClassName)}>
            <CardContent className={cn("flex items-center justify-between px-4")}>
              <div>
                <p className={cn("text-xs font-medium", item.labelClassName)}>{item.label}</p>
                <p className={cn("mt-1 text-4xl leading-none font-semibold text-slate-100")}>{item.value}</p>
              </div>
              <Icon className={cn("size-5", item.iconClassName)} />
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
