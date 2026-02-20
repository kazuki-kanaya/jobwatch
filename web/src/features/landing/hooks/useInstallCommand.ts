import { useMemo, useState } from "react";
import type { InstallMethod } from "@/features/landing/types";

export function useInstallCommand() {
  const [installMethod, setInstallMethod] = useState<InstallMethod>("brew");
  const [copied, setCopied] = useState(false);

  const installCommand = useMemo(
    () =>
      installMethod === "brew"
        ? "brew tap kazuki-kanaya/jobwatch && brew install jobwatch"
        : "curl -fsSL https://github.com/kazuki-kanaya/jobwatch/releases/latest/download/install.sh | bash",
    [installMethod],
  );

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return {
    installMethod,
    setInstallMethod,
    installCommand,
    copied,
    copyInstall,
  };
}
