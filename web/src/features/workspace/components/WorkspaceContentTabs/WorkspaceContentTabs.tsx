import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WorkspaceContentTab = "operations" | "people";

type WorkspaceContentTabsProps = {
  workspaceHeader: ReactNode;
  snapshot: ReactNode;
  operationsLabel: string;
  peopleLabel: string;
  operationsContent: ReactNode;
  peopleContent: ReactNode;
  hint?: ReactNode;
};

export function WorkspaceContentTabs({
  workspaceHeader,
  snapshot,
  operationsLabel,
  peopleLabel,
  operationsContent,
  peopleContent,
  hint,
}: WorkspaceContentTabsProps) {
  const [activeTab, setActiveTab] = useState<WorkspaceContentTab>("operations");

  return (
    <section
      className={cn(
        "rounded-[2rem] border border-slate-800/45 bg-slate-950/15 p-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.04)] md:p-6",
      )}
    >
      <div className={cn("grid gap-4")}>
        <div className={cn("space-y-3")}>
          {hint ? <p className={cn("text-sm text-slate-300/80")}>{hint}</p> : null}
          {workspaceHeader}
        </div>

        {snapshot}

        <div
          className={cn("flex flex-wrap items-center gap-2 rounded-2xl border border-slate-800/60 bg-slate-950/40 p-2")}
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("operations")}
            className={cn(
              "rounded-xl px-4 text-sm font-semibold",
              activeTab === "operations"
                ? "bg-cyan-500/15 text-cyan-100 hover:bg-cyan-500/20 hover:text-cyan-50"
                : "text-slate-300 hover:bg-slate-800/70 hover:text-slate-50",
            )}
          >
            {operationsLabel}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("people")}
            className={cn(
              "rounded-xl px-4 text-sm font-semibold",
              activeTab === "people"
                ? "bg-cyan-500/15 text-cyan-100 hover:bg-cyan-500/20 hover:text-cyan-50"
                : "text-slate-300 hover:bg-slate-800/70 hover:text-slate-50",
            )}
          >
            {peopleLabel}
          </Button>
        </div>

        <div className={cn("min-w-0")}>{activeTab === "operations" ? operationsContent : peopleContent}</div>
      </div>
    </section>
  );
}
