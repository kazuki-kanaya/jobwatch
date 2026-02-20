import LandingComparisonSection from "@/features/landing/components/LandingComparisonSection";
import LandingCtaSection from "@/features/landing/components/LandingCtaSection";
import LandingFeaturesSection from "@/features/landing/components/LandingFeaturesSection";
import LandingFooter from "@/features/landing/components/LandingFooter";
import LandingHeader from "@/features/landing/components/LandingHeader";
import LandingHeroSection from "@/features/landing/components/LandingHeroSection";
import LandingPainSection from "@/features/landing/components/LandingPainSection";
import "@/features/landing/landing.css";
import { useInstallCommand } from "@/features/landing/hooks/useInstallCommand";
import type { LandingPageViewProps } from "@/features/landing/types";
import { cn } from "@/lib/utils";

export default function LandingPageView({ texts, localeOptions, localeValue, onLocaleChange }: LandingPageViewProps) {
  const { installMethod, setInstallMethod, installCommand, copied, copyInstall } = useInstallCommand();

  return (
    <main
      className={cn(
        "landing-page min-h-screen bg-[radial-gradient(circle_at_50%_22%,rgba(59,130,246,0.25),transparent_35%),radial-gradient(circle_at_72%_24%,rgba(168,85,247,0.18),transparent_32%),#0a1020] text-slate-100",
      )}
    >
      <LandingHeader
        texts={texts}
        localeOptions={localeOptions}
        localeValue={localeValue}
        onLocaleChange={onLocaleChange}
      />
      <LandingHeroSection
        texts={texts}
        installMethod={installMethod}
        installCommand={installCommand}
        copied={copied}
        onMethodChange={setInstallMethod}
        onCopy={copyInstall}
      />
      <LandingPainSection texts={texts} />
      <LandingFeaturesSection texts={texts} />
      <LandingComparisonSection texts={texts} />
      <LandingCtaSection texts={texts} />
      <LandingFooter texts={texts} />
    </main>
  );
}
