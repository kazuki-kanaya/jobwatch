import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type JobSectionProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  list: ReactNode;
  detail: ReactNode;
  dialogs?: ReactNode;
};

export function JobSection({ title, subtitle, list, detail, dialogs }: JobSectionProps) {
  return (
    <>
      <Card
        className={cn(
          "rounded-3xl border border-slate-700/70 bg-slate-900/80 py-5 shadow-[0_16px_40px_rgba(2,6,23,0.45)]",
        )}
      >
        <CardHeader className={cn("space-y-2 px-6 pb-3")}>
          <CardTitle className={cn("text-2xl font-semibold tracking-tight text-slate-100")}>{title}</CardTitle>
          {subtitle ? <p className={cn("text-sm text-slate-400")}>{subtitle}</p> : null}
        </CardHeader>
        <CardContent className={cn("px-6")}>
          <div className={cn("grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]")}>
            <section className={cn("min-w-0 rounded-2xl border border-slate-700/70 bg-slate-900/45 p-3")}>
              {list}
            </section>
            <div className={cn("min-w-0")}>{detail}</div>
          </div>
        </CardContent>
      </Card>
      {dialogs}
    </>
  );
}
