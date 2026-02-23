import type { LandingMessages } from "./types";

export const enMessages = {
  languageLabel: "Language",
  languageSwitchLabel: "日本語",
  nav: {
    features: "Features",
    howItWorks: "Why Jobwatch",
    comparison: "Comparison",
    docs: "Docs",
    getStarted: "Get Started",
  },
  hero: {
    releaseBadge: "Now in Beta",
    titleLead: "Stop checking",
    titleAccent: "SSH",
    titleTail: " just to see if it is still running",
    subtitle:
      "Track long-running processes in real time. Get notified on failures and manage everything from a unified dashboard with no code changes.",
    installHeading: "Install",
    copyLabel: "Copy",
    copiedLabel: "Copied",
    quickStartLines: [
      "# Run as usual",
      "python train_model.py --epochs 100",
      "# One-time setup (generate jobwatch.yaml)",
      "jobwatch init",
      "# Wrap your command with jobwatch",
      "jobwatch run python train_model.py --epochs 100",
    ],
  },
  pain: {
    eyebrow: "The pain",
    title: "Why Jobwatch?",
    subtitle:
      "A workflow that relies on repeatedly checking processes over SSH leads to missed completions and delayed failure detection. Jobwatch reduces that wasted wait time and rework, and lowers operational burden.",
    cards: [
      {
        title: "Silent Stops",
        body: "You miss that a run finished earlier than expected and lose time waiting. On another day, a job dies five minutes after launch, and you only notice the next morning. Alerts prevent this waste.",
      },
      {
        title: "Slow Debug Cycles",
        body: "A background run fails, but the cause is unclear. With Jobwatch, you can immediately check exit status and error output.",
      },
      {
        title: "Multi-Host Blind Spots",
        body: "It is hard to know what is running on which server. Jobwatch gives you one cross-host view of runtime status and logs.",
      },
    ],
  },
  features: {
    title: "Built for engineers who run real workloads.",
    cards: [
      {
        title: "Zero Code Changes",
        body: "Wrap existing commands with jobwatch. No SDK imports, no instrumentation boilerplate.",
      },
      {
        title: "Instant Slack Alerts",
        body: "With webhook integration, failure and completion notifications are sent to your Slack channel right away.",
      },
      {
        title: "Unified Dashboard",
        body: "Inspect status, logs, and runtime context across your infrastructure in one place.",
      },
    ],
  },
  comparison: {
    title: "How It Compares",
    subtitle: "Jobwatch focuses on execution health rather than experiment metrics.",
    featureColumn: "Feature",
    rows: [
      {
        label: "Primary Goal",
        jobwatch: "Execution monitoring",
        mlflow: "Experiment management",
        tensorboard: "Training metrics visualization",
      },
      {
        label: "Adoption Method",
        jobwatch: "CLI wrapper (no code changes)",
        mlflow: "SDK integration",
        tensorboard: "SDK integration",
      },
      {
        label: "Monitoring Target",
        jobwatch: "Running processes",
        mlflow: "Experiment logs",
        tensorboard: "Training logs",
      },
      {
        label: "Abnormal Exit Alerts",
        jobwatch: "Instant alerts (Slack)",
        mlflow: "Not built-in",
        tensorboard: "None",
      },
      {
        label: "Monitoring Scope",
        jobwatch: "Across multiple servers",
        mlflow: "Per project",
        tensorboard: "Local-first",
      },
    ],
  },
  cta: {
    title: "Ready to automate your monitoring?",
    subtitle: "Get started in a few minutes.",
    primary: "Get Started for Free",
    secondary: "Documentation",
  },
  footer: {
    title: "If Jobwatch helps, leave a star on GitHub.",
    subtitle: "Jobwatch is open source. Stars and feedback directly support development.",
    button: "Star on GitHub",
  },
} satisfies LandingMessages;
