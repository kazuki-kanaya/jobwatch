import { Activity, CheckCircle2, CircleAlert, TimerReset } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardSnapshot } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type DashboardSnapshotSectionProps = {
  snapshot: DashboardSnapshot;
  labels: {
    tracked: string;
    running: string;
    completed: string;
    failed: string;
  };
};

export default function DashboardSnapshotSection({ snapshot, labels }: DashboardSnapshotSectionProps) {
  const cards = [
    {
      key: "total",
      label: labels.tracked,
      icon: Activity,
      iconClassName: "text-slate-100",
      cardClassName: "border-slate-700/60 bg-slate-900/80",
      labelClassName: "text-slate-300",
    },
    {
      key: "running",
      label: labels.running,
      icon: TimerReset,
      iconClassName: "text-cyan-200",
      cardClassName: "border-cyan-400/35 bg-cyan-500/10",
      labelClassName: "text-cyan-100",
    },
    {
      key: "completed",
      label: labels.completed,
      icon: CheckCircle2,
      iconClassName: "text-emerald-200",
      cardClassName: "border-emerald-400/35 bg-emerald-500/10",
      labelClassName: "text-emerald-100",
    },
    {
      key: "failed",
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
        const value = snapshot[item.key];
        const Icon = item.icon;

        return (
          <Card key={item.key} className={cn("py-4", item.cardClassName)}>
            <CardContent className={cn("flex items-center justify-between px-4")}>
              <div>
                <p className={cn("text-xs font-medium", item.labelClassName)}>{item.label}</p>
                <p className={cn("mt-1 text-2xl font-semibold text-slate-100")}>{value}</p>
              </div>
              <Icon className={cn("size-5", item.iconClassName)} />
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
