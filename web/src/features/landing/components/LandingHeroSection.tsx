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
    <section className={cn("relative mx-auto w-full max-w-6xl space-y-8 overflow-hidden px-4 py-16 md:px-8 md:py-24")}>
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl",
        )}
      />
      <div
        className={cn("pointer-events-none absolute right-10 top-20 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl")}
      />
      <div className={cn("mx-auto max-w-5xl text-center")}>
        <p
          className={cn(
            "inline-flex rounded-full border border-blue-400/35 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-300",
          )}
        >
          {texts.landing_release_badge}
        </p>
        <h1 className={cn("mt-6 text-5xl leading-[1.07] font-bold tracking-tight text-white md:text-6xl lg:text-7xl")}>
          {texts.landing_hero_title_a}
          <br />
          <span
            className={cn("bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent")}
          >
            {texts.landing_hero_title_ssh} {texts.landing_hero_title_b}
          </span>
        </h1>
        <p className={cn("mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-2xl")}>
          {texts.landing_hero_subtitle}
        </p>
        <div className={cn("mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row")}>
          <Link to="/dashboard" className={cn("inline-flex")}>
            <Button
              className={cn(
                "h-12 w-48 justify-center bg-blue-500 px-8 text-base font-semibold text-white shadow-[0_0_28px_rgba(59,130,246,0.35)] hover:bg-blue-400",
              )}
            >
              {texts.landing_get_started}
            </Button>
          </Link>
          <a href="#docs" className={cn("inline-flex")}>
            <Button
              variant="outline"
              className={cn(
                "h-12 w-48 justify-center border-[#365078] bg-[#141f33] px-8 text-base font-semibold text-slate-200 hover:bg-[#1a2940] hover:text-white",
              )}
            >
              {texts.landing_cta_secondary}
            </Button>
          </a>
        </div>
      </div>

      <div className={cn("mx-auto w-full max-w-5xl")}>
        <div className={cn("rounded-xl border border-[#2a3748] bg-[#141b24] shadow-[0_0_42px_rgba(59,130,246,0.18)]")}>
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
      </div>

      <div className={cn("mx-auto max-w-4xl")}>
        <div
          className={cn(
            "relative rounded-xl border border-[#314760] bg-[#171d29] p-4 shadow-[0_0_48px_rgba(56,189,248,0.14)] md:p-6",
          )}
        >
          <div className={cn("mb-3 flex items-center gap-2")}>
            <span className={cn("size-3 rounded-full bg-red-400")} />
            <span className={cn("size-3 rounded-full bg-yellow-400")} />
            <span className={cn("size-3 rounded-full bg-green-400")} />
            <span className={cn("ml-2 font-mono text-xs text-slate-500")}>user@machine:~</span>
          </div>
          <div className={cn("space-y-2 font-mono text-sm text-slate-300 md:text-lg")}>
            <p># Run your training script normally</p>
            <p className={cn("text-slate-500 line-through")}>python train_model.py --epochs 100</p>
            <p># One-time setup (generate jobwatch.yaml)</p>
            <p className={cn("text-amber-300")}>
              <span className={cn("text-cyan-300")}>➜</span> jobwatch init
            </p>
            <p># Wrap it with jobwatch</p>
            <p>
              <span className={cn("text-cyan-300")}>➜</span> <span className={cn("text-amber-300")}>jobwatch run</span>{" "}
              python train_model.py --epochs 100
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
