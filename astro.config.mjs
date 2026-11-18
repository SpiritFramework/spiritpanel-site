import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://spiritpanel.co.uk",
  output: "static",
  trailingSlash: "always",
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
