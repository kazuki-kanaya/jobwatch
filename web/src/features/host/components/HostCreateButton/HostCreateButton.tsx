import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HostCreateButtonProps = {
  addLabel: string;
  noPermissionLabel: string;
  canCreate: boolean;
  onCreateHost: () => void;
};

export function HostCreateButton({ addLabel, noPermissionLabel, canCreate, onCreateHost }: HostCreateButtonProps) {
  return (
    <div className={cn("flex flex-wrap gap-2")}>
      <Button
        type="button"
        size="sm"
        onClick={onCreateHost}
        disabled={!canCreate}
        title={!canCreate ? noPermissionLabel : undefined}
        className={cn(
          "h-11 cursor-pointer rounded-xl border border-cyan-400/35 bg-cyan-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed",
        )}
      >
        <Plus className={cn("size-4")} />
        {addLabel}
      </Button>
    </div>
  );
}
