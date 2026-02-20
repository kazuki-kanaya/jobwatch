import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import type { LandingTexts } from "@/features/landing/types";
import { cn } from "@/lib/utils";

type LandingCtaSectionProps = {
  texts: LandingTexts;
};

export default function LandingCtaSection({ texts }: LandingCtaSectionProps) {
  return (
    <section id="docs" className={cn("mx-auto w-full max-w-5xl px-4 py-16 md:px-8 md:py-20")}>
      <div
        className={cn(
          "rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/20 via-blue-400/10 to-rose-400/10 px-6 py-12 text-center shadow-[0_20px_60px_rgba(6,78,120,0.25)] md:px-10",
        )}
      >
        <h3 className={cn("text-3xl font-bold text-white md:text-4xl")}>{texts.landing_cta_title}</h3>
        <p className={cn("mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-200")}>{texts.landing_cta_subtitle}</p>
        <div className={cn("mt-8 flex flex-wrap justify-center gap-3")}>
          <Link to="/dashboard">
            <Button className={cn("h-11 bg-cyan-400 px-7 text-slate-950 hover:bg-cyan-300")}>
              {texts.landing_cta_primary}
            </Button>
          </Link>
          <a href="https://github.com/kazuki-kanaya/jobwatch" target="_blank" rel="noreferrer">
            <Button
              variant="outline"
              className={cn("h-11 border-slate-600 bg-slate-900/60 px-7 text-slate-100 hover:bg-slate-800")}
            >
              {texts.landing_cta_secondary}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
