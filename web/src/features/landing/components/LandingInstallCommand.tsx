import { Check, Copy, Terminal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LandingInstallCommandProps = {
  command: string;
  copyLabel: string;
  copiedLabel: string;
};

export default function LandingInstallCommand({ command, copyLabel, copiedLabel }: LandingInstallCommandProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={cn("flex items-stretch overflow-hidden rounded-lg border border-slate-700 bg-slate-900/80")}>
      <div className={cn("flex items-center px-3 text-slate-500")}>
        <Terminal className={cn("size-4")} />
      </div>
      <code className={cn("flex-1 overflow-x-auto px-2 py-3 font-mono text-xs text-cyan-200 md:text-sm")}>
        {command}
      </code>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => void onCopy()}
        className={cn(
          "h-auto rounded-none border-l border-slate-700 px-3 text-slate-300 hover:bg-slate-800 hover:text-white",
        )}
      >
        {copied ? <Check className={cn("size-4")} /> : <Copy className={cn("size-4")} />}
        <span className={cn("hidden text-xs md:inline")}>{copied ? copiedLabel : copyLabel}</span>
      </Button>
    </div>
  );
}
