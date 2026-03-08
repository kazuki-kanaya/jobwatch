import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type WorkspaceSectionProps = {
  title: ReactNode;
  headerActions?: ReactNode;
  summary?: ReactNode;
  content: ReactNode;
  dialogs?: ReactNode;
};

export function WorkspaceSection({ title, headerActions, summary, content, dialogs }: WorkspaceSectionProps) {
  return (
    <>
      <Card
        className={cn(
          "relative rounded-3xl border border-slate-700/70 bg-slate-900/80 py-5 shadow-[0_16px_40px_rgba(2,6,23,0.45)]",
        )}
      >
        <CardHeader className={cn("space-y-5 px-6 pb-4")}>
          <div className={cn("flex flex-wrap items-center justify-between gap-3")}>
            <CardTitle className={cn("text-2xl font-semibold tracking-tight text-slate-100")}>{title}</CardTitle>
            {headerActions}
          </div>
          {summary}
        </CardHeader>

        <CardContent className={cn("space-y-5 px-6")}>{content}</CardContent>
      </Card>
      {dialogs}
    </>
  );
}
