import { Copy } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import type { InstallMethod, LandingTexts } from "@/features/landing/types";
import { cn } from "@/lib/utils";

type LandingHeroSectionProps = {
  texts: LandingTexts;
  installMethod: InstallMethod;
  installCommand: string;
  copied: boolean;
  onMethodChange: (method: InstallMethod) => void;
  onCopy: () => Promise<void>;
};

export default function LandingHeroSection({
  texts,
  installMethod,
  installCommand,
  copied,
  onMethodChange,
  onCopy,
}: LandingHeroSectionProps) {
  return (
    <section className={cn("relative mx-auto w-full max-w-6xl space-y-10 overflow-hidden px-4 py-12 md:px-8 md:py-16")}>
      <div
        className={cn("pointer-events-none absolute -left-10 top-6 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl")}
      />
      <div
        className={cn("pointer-events-none absolute right-4 top-12 h-60 w-60 rounded-full bg-fuchsia-500/10 blur-3xl")}
      />
      <div className={cn("grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-start")}>
        <div className={cn("mx-auto max-w-3xl text-left lg:mx-0")}>
          <p
            className={cn(
              "inline-flex rounded-full border border-blue-400/35 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-300",
            )}
          >
            {texts.landing_release_badge}
          </p>
          <h1 className={cn("mt-5 text-4xl leading-[1.2] font-bold tracking-tight text-white md:text-5xl lg:text-6xl")}>
            {texts.landing_hero_title_a}
            <br />
            <span
              className={cn("bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent")}
            >
              {texts.landing_hero_title_ssh}
            </span>
            {texts.landing_hero_title_b}
          </h1>
          <p className={cn("mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg")}>
            {texts.landing_hero_subtitle}
          </p>
          <div className={cn("mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center")}>
            <Link to="/dashboard" className={cn("inline-flex")}>
              <Button
                className={cn(
                  "h-12 min-w-44 justify-center bg-blue-500 px-8 text-base font-semibold text-white shadow-[0_0_28px_rgba(59,130,246,0.35)] hover:bg-blue-400",
                )}
              >
                {texts.landing_get_started}
              </Button>
            </Link>
            <a href="#docs" className={cn("inline-flex")}>
              <Button
                variant="outline"
                className={cn(
                  "h-12 min-w-44 justify-center border-[#365078] bg-[#141f33] px-8 text-base font-semibold text-slate-200 hover:bg-[#1a2940] hover:text-white",
                )}
              >
                {texts.landing_cta_secondary}
              </Button>
            </a>
          </div>
        </div>

        <div
          className={cn(
            "rounded-2xl border border-[#2a3748] bg-[#111a2b]/95 p-4 shadow-[0_0_48px_rgba(59,130,246,0.18)] md:p-5",
          )}
        >
          <p className={cn("mb-3 text-sm font-semibold text-slate-300")}>Install</p>
          <div className={cn("rounded-xl border border-[#2a3748] bg-[#141b24]")}>
            <div className={cn("flex items-center justify-between border-b border-[#2a3748] px-3 py-3")}>
              <div className={cn("inline-flex rounded-md border border-[#2f3f52] bg-[#151f2b] p-1")}>
                {(["brew", "curl"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => onMethodChange(method)}
                    className={cn(
                      "rounded px-4 py-1.5 text-sm font-semibold transition",
                      installMethod === method ? "bg-cyan-400 text-slate-950" : "text-slate-300 hover:text-white",
                    )}
                  >
                    {method}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => void onCopy()}
                className={cn("px-2 text-slate-400 hover:text-cyan-300")}
                aria-label={copied ? "copied" : "copy install command"}
              >
                <Copy className={cn("size-4")} />
              </button>
            </div>
            <div className={cn("px-4 py-4")}>
              <code
                className={cn(
                  "block whitespace-normal break-all font-mono text-sm leading-7 text-slate-100 md:text-base",
                )}
              >
                $ {installCommand}
              </code>
            </div>
          </div>
          <div
            className={cn(
              "mt-4 rounded-xl border border-[#314760] bg-[#171d29] p-4 shadow-[0_0_24px_rgba(56,189,248,0.1)] md:p-5",
            )}
          >
            <div className={cn("mb-3 flex items-center gap-2")}>
              <span className={cn("size-3 rounded-full bg-red-400")} />
              <span className={cn("size-3 rounded-full bg-yellow-400")} />
              <span className={cn("size-3 rounded-full bg-green-400")} />
              <span className={cn("ml-2 font-mono text-xs text-slate-500")}>user@machine:~</span>
            </div>
            <div className={cn("space-y-2 font-mono text-sm text-slate-300 md:text-base")}>
              <p># Run your training script normally</p>
              <p className={cn("text-slate-500 line-through")}>python train_model.py --epochs 100</p>
              <p># One-time setup (generate jobwatch.yaml)</p>
              <p className={cn("text-amber-300")}>
                <span className={cn("text-cyan-300")}>➜</span> jobwatch init
              </p>
              <p># Wrap it with jobwatch</p>
              <p>
                <span className={cn("text-cyan-300")}>➜</span>{" "}
                <span className={cn("text-amber-300")}>jobwatch run</span> python train_model.py --epochs 100
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
