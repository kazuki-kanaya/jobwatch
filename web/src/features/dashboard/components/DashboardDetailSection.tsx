// Responsibility: Render the right-side detail panel placeholder for selected job information.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type DashboardDetailSectionProps = {
  title: string;
  selectedJobLabel: string;
  latestLogsLabel: string;
};

export default function DashboardDetailSection({
  title,
  selectedJobLabel,
  latestLogsLabel,
}: DashboardDetailSectionProps) {
  return (
    <Card className={cn("h-full border-slate-700/60 bg-slate-900/80 py-4")}>
      <CardHeader className={cn("px-4")}>
        <CardTitle className={cn("text-sm font-semibold text-slate-200")}>{title}</CardTitle>
      </CardHeader>
      <CardContent className={cn("space-y-4 px-4")}>
        <section className={cn("space-y-2")}>
          <p className={cn("font-mono text-xs tracking-[0.14em] text-slate-500 uppercase")}>{selectedJobLabel}</p>
          <Skeleton className={cn("h-5 bg-slate-800")} />
          <Skeleton className={cn("h-4 w-2/3 bg-slate-800")} />
        </section>
        <Separator className={cn("bg-slate-700")} />
        <section className={cn("space-y-2")}>
          <p className={cn("font-mono text-xs tracking-[0.14em] text-slate-500 uppercase")}>{latestLogsLabel}</p>
          <Skeleton className={cn("h-4 bg-slate-800")} />
          <Skeleton className={cn("h-4 bg-slate-800")} />
          <Skeleton className={cn("h-4 w-4/5 bg-slate-800")} />
        </section>
      </CardContent>
    </Card>
  );
}
