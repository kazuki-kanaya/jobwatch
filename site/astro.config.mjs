// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ja"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations:
  [
    icon(),
    starlight({
      title: "Obsern",
      description: "Lightweight job monitoring for long-running ML and compute experiments.",
      logo: {
        src: "./src/assets/logo.png",
      },
      favicon: "/favicon.ico",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/kazuki-kanaya/obsern" }],
      sidebar: [
        {
          label: "CLI",
          items: [
            { slug: "docs", label: "Getting Started" },
            { slug: "docs/cli", label: "CLI Overview" },
            { slug: "docs/cli/installation", label: "Installation" },
            { slug: "docs/cli/quickstart", label: "Quickstart" },
            { slug: "docs/cli/configuration", label: "Configuration" },
            { slug: "docs/cli/cli-reference", label: "CLI Reference" },
            { slug: "docs/cli/notifications", label: "Notifications" },
            { slug: "docs/cli/troubleshooting", label: "Troubleshooting" },
            { slug: "docs/cli/faq", label: "FAQ" },
          ],
        },
        {
          label: "Dashboard",
          items: [
            { slug: "docs/dashboard", label: "Dashboard Guide" },
            { slug: "docs/dashboard/workspaces", label: "Workspaces" },
            { slug: "docs/dashboard/hosts-and-tokens", label: "Hosts & Tokens" },
            { slug: "docs/dashboard/jobs", label: "Jobs" },
            { slug: "docs/dashboard/members-and-invitations", label: "Members & Invitations" },
            { slug: "docs/dashboard/roles-and-permissions", label: "Roles & Permissions" },
            { slug: "docs/dashboard/troubleshooting", label: "Troubleshooting" },
            { slug: "docs/dashboard/faq", label: "FAQ" },
          ],
        },
      ],
      customCss: [
        "./src/styles/global.css",
      ],
    }),
    mdx(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
