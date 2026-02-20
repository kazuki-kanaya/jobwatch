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
    <section
      id="features"
      className={cn("mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:px-8 md:py-20")}
    >
      <div className={cn("rounded-2xl border border-[#243448] bg-[#0f1928]/75 p-6 md:p-8")}>
        <h2 className={cn("text-3xl font-bold leading-tight text-white md:text-4xl")}>
          {texts.landing_features_title}
        </h2>
        <ul className={cn("mt-8 space-y-6")}>
          {featureCards.map((feature) => {
            const Icon = icons[feature.icon];
            return (
              <li key={feature.titleKey} className={cn("rounded-xl border border-[#2d3d52] bg-[#121f31] p-4")}>
                <p className={cn("flex items-center gap-2 text-lg font-semibold text-white")}>
                  <Icon className={cn("size-4 text-cyan-300")} />
                  {texts[feature.titleKey]}
                </p>
                <p className={cn("mt-2 text-sm leading-7 text-slate-300")}>{texts[feature.bodyKey]}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <div
        className={cn(
          "relative overflow-visible rounded-2xl border border-[#2d3948] bg-[#0f1726] p-3 shadow-[0_20px_40px_rgba(2,6,23,0.28)] md:p-4",
        )}
      >
        <div
          className={cn(
            "overflow-hidden rounded-xl border border-[#223247] bg-[#0b1321] shadow-[0_12px_28px_rgba(2,6,23,0.32)]",
          )}
        >
          <img
            alt="Jobwatch dashboard preview"
            src="/dashboard.png"
            className={cn("h-full w-full object-contain object-center opacity-92")}
          />
        </div>
        <div
          className={cn(
            "absolute bottom-8 left-4 z-[9] w-[48%] -rotate-[6deg] overflow-hidden rounded-2xl border border-rose-300/65 bg-white/94 shadow-[0_18px_34px_rgba(2,6,23,0.42)] backdrop-blur-sm md:bottom-10 md:left-8 md:w-[44%]",
          )}
        >
          <img
            alt="Jobwatch slack failed notification preview"
            src="/slack_failed.png"
            className={cn("h-full w-full object-contain object-center")}
          />
        </div>
        <div
          className={cn(
            "absolute bottom-2 right-2 z-10 w-[56%] rotate-[6deg] overflow-hidden rounded-2xl border border-[#a7f3d0]/60 bg-white/96 shadow-[0_22px_40px_rgba(2,6,23,0.52)] backdrop-blur-sm md:bottom-4 md:right-4 md:w-[50%]",
          )}
        >
          <img
            alt="Jobwatch slack success notification preview"
            src="/slack_success.png"
            className={cn("h-full w-full object-contain object-center")}
          />
        </div>
      </div>
    </section>
  );
}
