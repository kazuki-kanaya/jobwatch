import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MemberSectionProps = {
  title: ReactNode;
  headerActions?: ReactNode;
  list: ReactNode;
  dialogs?: ReactNode;
};

export function MemberSection({ title, headerActions, list, dialogs }: MemberSectionProps) {
  return (
    <>
      <Card
        className={cn(
          "relative min-w-0 rounded-3xl border border-slate-700/70 bg-slate-900/80 py-5 shadow-[0_16px_40px_rgba(2,6,23,0.45)]",
        )}
      >
        <CardHeader className={cn("min-w-0 space-y-5 px-4 pb-4 sm:px-6")}>
          <div className={cn("flex flex-wrap items-center justify-between gap-3")}>
            <CardTitle className={cn("text-2xl font-semibold tracking-tight text-slate-100")}>{title}</CardTitle>
            {headerActions}
          </div>
        </CardHeader>

        <CardContent className={cn("min-w-0 space-y-5 px-4 sm:px-6")}>{list}</CardContent>
      </Card>
      {dialogs}
    </>
  );
}
