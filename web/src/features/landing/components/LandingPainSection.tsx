import { Grid3X3, Unplug, Waves } from "lucide-react";
import { painCards } from "@/features/landing/constants";
import type { LandingTexts } from "@/features/landing/types";
import { cn } from "@/lib/utils";

type LandingPainSectionProps = {
  texts: LandingTexts;
};

const icons = {
  unplug: Unplug,
  waves: Waves,
  grid: Grid3X3,
} as const;

export default function LandingPainSection({ texts }: LandingPainSectionProps) {
  return (
    <section id="how-it-works" className={cn("border-y border-[#1e2937] bg-[#0b111d] py-16 md:py-20")}>
      <div className={cn("mx-auto w-full max-w-6xl px-4 md:px-8")}>
        <p className={cn("text-xs font-bold tracking-[0.18em] text-cyan-300 uppercase")}>
          {texts.landing_pain_eyebrow}
        </p>
        <h2 className={cn("mt-3 text-3xl font-bold leading-tight text-white md:text-4xl")}>
          {texts.landing_pain_title}
        </h2>
        <p
          className={cn(
            "mt-5 max-w-4xl border-l-2 border-cyan-300/55 pl-4 text-base leading-8 text-slate-300 md:pl-5 md:text-lg",
          )}
        >
          {texts.landing_pain_subtitle}
        </p>
        <div className={cn("mt-10 grid gap-5 md:grid-cols-3")}>
          {painCards.map((card) => {
            const Icon = icons[card.icon];
            return (
              <article
                key={card.titleKey}
                className={cn(
                  "flex h-full flex-col rounded-xl border border-[#2c3947] bg-[#151c26] p-6 shadow-[0_10px_30px_rgba(2,6,23,0.25)]",
                )}
              >
                <div
                  className={cn(
                    "mb-4 inline-flex size-10 items-center justify-center rounded-lg border border-white/10",
                    card.tone,
                  )}
                >
                  <Icon className={cn("size-4")} />
                </div>
                <p className={cn("text-lg font-semibold text-white")}>{texts[card.titleKey]}</p>
                <p className={cn("mt-3 text-sm leading-7 text-slate-300")}>{texts[card.bodyKey]}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
