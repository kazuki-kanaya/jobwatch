import { BellRing, Code2, Grid3X3 } from "lucide-react";
import { featureCards } from "@/features/landing/constants";
import type { LandingTexts } from "@/features/landing/types";
import { cn } from "@/lib/utils";

type LandingFeaturesSectionProps = {
  texts: LandingTexts;
};

const icons = {
  code2: Code2,
  bell: BellRing,
  grid: Grid3X3,
} as const;

export default function LandingFeaturesSection({ texts }: LandingFeaturesSectionProps) {
  return (
    <section id="features" className={cn("mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-8")}>
      <div>
        <h2 className={cn("text-4xl font-bold leading-tight text-white")}>{texts.landing_features_title}</h2>
        <ul className={cn("mt-8 space-y-6")}>
          {featureCards.map((feature) => {
            const Icon = icons[feature.icon];
            return (
              <li key={feature.titleKey}>
                <p className={cn("flex items-center gap-2 text-lg font-semibold text-white")}>
                  <Icon className={cn("size-4 text-cyan-300")} />
                  {texts[feature.titleKey]}
                </p>
                <p className={cn("mt-1 text-sm text-slate-400")}>{texts[feature.bodyKey]}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={cn("relative overflow-hidden rounded-xl border border-[#2d3948] bg-[#15202d]")}>
        <img
          alt="Jobwatch dashboard preview"
          src="/dashboard.png"
          className={cn("h-full w-full object-cover opacity-70")}
        />
        <div className={cn("absolute inset-0 flex items-center justify-center")}>
          <div
            className={cn(
              "flex size-16 items-center justify-center rounded-full border border-cyan-300/60 bg-cyan-300/20 text-cyan-200",
            )}
          >
            ▶
          </div>
        </div>
      </div>
    </section>
  );
}
