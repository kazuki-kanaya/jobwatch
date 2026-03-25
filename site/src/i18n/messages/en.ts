import type { LandingMessages } from "./types";

export const enMessages = {
  languageLabel: "Language",
  languageSwitchLabel: "日本語",
  nav: {
    features: "Features",
    howItWorks: "Why Obsern",
    comparison: "Comparison",
    docs: "Docs",
    getStarted: "Go to Dashboard",
  },
  hero: {
    releaseBadge: "Now in Beta",
    titleLead: "Stop checking",
    titleAccent: "SSH",
    titleTail: " just to see if it is still running",
    subtitle:
      "Track long-running processes in real time. Get notified on failures and manage everything from a unified dashboard with no code changes.",
    installHeading: "Installation",
    copyLabel: "Copy",
    copiedLabel: "Copied",
    quickStartLines: [
      "# Run as usual",
      "python train_model.py --epochs 100",
      "# One-time setup (generate obsern.yaml)",
      "obsern init",
      "# Wrap your command with obsern",
      "obsern run python train_model.py --epochs 100",
    ],
  },
  demo: {
    eyebrow: "HOW IT WORKS",
    title: "No SDK required. Lightweight and ready to use.",
    subtitle: "Just wrap your existing command and start monitoring in minutes.",
    alt: "Animated demo of the Obsern dashboard",
  },
  pain: {
    eyebrow: "The pain",
    title: "Why Obsern?",
    subtitle:
      "A workflow that relies on repeatedly checking processes over SSH leads to missed completions and delayed failure detection. Obsern reduces that wasted wait time and rework, and lowers operational burden.",
    cards: [
      {
        title: "Silent Stops",
        body: "It stopped midway, but you did not notice until much later. With alerts, you could have acted sooner.",
      },
      {
        title: "Slow Debug Cycles",
        body: "A background run fails, but the cause is unclear. With Obsern, you can immediately check exit status and error output.",
      },
      {
        title: "Multi-Host Blind Spots",
        body: "It is hard to know what is running on which server. Obsern gives you one cross-host view of runtime status and logs.",
      },
    ],
  },
  features: {
    title: "Keep execution status clear for both individuals and teams.",
    tabs: {
      dashboard: "Dashboard",
      slackAlerts: "Slack Alerts",
    },
    cards: [
      {
        title: "Zero Code Changes",
        body: "Wrap existing commands with obsern. No SDK integration or instrumentation boilerplate required.",
      },
      {
        title: "Instant Slack Alerts",
        body: "With webhook integration, failure, completion, and runtime log notifications are sent to your Slack channel right away.",
      },
      {
        title: "Unified Dashboard",
        body: "Check status, logs, and runtime hosts in one place, with smoother root-cause investigation.",
      },
      {
        title: "Optimized for Team Use",
        body: "Share workspaces, invite members, and control access with owner/editor/viewer roles so operations stay clear and secure.",
      },
    ],
  },
  comparison: {
    title: "How It Compares",
    subtitle: "Obsern focuses on execution health rather than experiment metrics.",
    featureColumn: "Feature",
    rows: [
      {
        label: "Primary Goal",
        obsern: "Execution monitoring",
        mlflow: "Experiment management",
        tensorboard: "Training metrics visualization",
      },
      {
        label: "Adoption Method",
        obsern: "CLI wrapper (no code changes)",
        mlflow: "SDK integration",
        tensorboard: "SDK integration",
      },
      {
        label: "Monitoring Target",
        obsern: "Running processes",
        mlflow: "Experiment logs",
        tensorboard: "Training logs",
      },
      {
        label: "Abnormal Exit Alerts",
        obsern: "Instant alerts (Slack)",
        mlflow: "Not built-in",
        tensorboard: "None",
      },
      {
        label: "Monitoring Scope",
        obsern: "Across multiple servers",
        mlflow: "Per project",
        tensorboard: "Local-first",
      },
    ],
  },
  cta: {
    title: "Ready to automate your monitoring?",
    subtitle: "Get started in a few minutes.",
    primary: "Go to Dashboard",
    secondary: "Documentation",
  },
  footer: {
    title: "If Obsern helps, leave a star on GitHub.",
    subtitle: "Obsern is open source. Stars and feedback directly support development.",
    button: "Star on GitHub",
  },
} satisfies LandingMessages;
