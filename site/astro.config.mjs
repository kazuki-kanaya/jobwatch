// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
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

  integrations: [
    icon(),
    starlight({
      title: "Obsern Docs",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/kazuki-kanaya/obsern" }],
      sidebar: [
        {
          label: "日本語",
          items: [
            { label: "Guides", autogenerate: { directory: "docs/guides" } },
            { label: "Reference", autogenerate: { directory: "docs/reference" } },
          ],
        },
        {
          label: "English",
          items: [
            { label: "Guides", autogenerate: { directory: "en/docs/guides" } },
            { label: "Reference", autogenerate: { directory: "en/docs/reference" } },
          ],
        },
      ],
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
