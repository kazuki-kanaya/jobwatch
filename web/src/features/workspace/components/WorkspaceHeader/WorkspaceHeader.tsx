import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type WorkspaceHeaderProps = {
  title: string;
  workspaceId: string;
  workspaceName: string;
  hint?: string;
};

export function WorkspaceHeader({ title, workspaceId, workspaceName, hint }: WorkspaceHeaderProps) {
  return (
    <Card
      className={cn(
        "rounded-2xl border border-[#33538b]/70 bg-[#0b1a3f]/70 py-4 shadow-[inset_0_1px_0_rgba(151,180,255,0.08)]",
      )}
    >
      <CardContent className={cn("space-y-3 px-5")}>
        <p className={cn("text-[11px] font-semibold tracking-[0.2em] text-blue-200/65 uppercase")}>{title}</p>
        <p className={cn("text-2xl font-semibold leading-tight text-blue-50 md:text-[2rem]")}>{workspaceName}</p>
        <p className={cn("truncate text-sm text-blue-100/75")} title={workspaceId}>
          <span className={cn("font-medium text-blue-100/80")}>Workspace ID:</span>{" "}
          <span className={cn("font-mono text-base text-blue-50/95")}>{workspaceId}</span>
        </p>
        {hint ? <p className={cn("text-sm text-blue-100/65")}>{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
