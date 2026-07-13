import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";

export default defineConfig({
  site: "https://www.maybedding.vn",
  output: "server",
  adapter: node({ mode: "standalone" }),
  security: {
    allowedDomains: [
      { hostname: "maybedding.vn", protocol: "https" },
      { hostname: "www.maybedding.vn", protocol: "https" },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
