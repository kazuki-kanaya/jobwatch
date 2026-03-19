import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CopyableCodeBlockProps = {
  content: string;
  copyLabel: string;
  copiedLabel: string;
  copied: boolean;
  isCopyDisabled?: boolean;
  onCopy: () => void;
  className?: string;
  contentClassName?: string;
};

export function CopyableCodeBlock({
  content,
  copyLabel,
  copiedLabel,
  copied,
  isCopyDisabled,
  onCopy,
  className,
  contentClassName,
}: CopyableCodeBlockProps) {
  return (
    <div className={cn("min-w-0 w-full max-w-full rounded-xl border border-slate-700/80 bg-slate-950/55", className)}>
      <div className={cn("flex justify-end p-1")}>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCopy}
          disabled={isCopyDisabled}
          className={cn(
            "h-6 cursor-pointer px-2 text-[11px] text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 disabled:cursor-not-allowed",
          )}
        >
          <Copy className={cn("size-3.5")} />
          {copied ? copiedLabel : copyLabel}
        </Button>
      </div>
      <pre
        className={cn(
          "max-h-52 min-w-0 max-w-full overflow-x-auto overflow-y-auto whitespace-pre px-3 pb-3 font-mono text-xs text-slate-200",
          contentClassName,
        )}
      >
        <code className={cn("block min-w-max")}>{content}</code>
      </pre>
    </div>
  );
}
