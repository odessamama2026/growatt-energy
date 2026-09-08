import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
export default defineConfig(({ command, isPreview }) => ({
  define: { "import.meta.env.VITE_SITE_LIVE": JSON.stringify(process.env.VERCEL_ENV === "preview" ? "false" : process.env.VITE_SITE_LIVE || "false") },
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 8081,
    strictPort: true,
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    ...(command === "build" || isPreview
      ? [
          nitro({ preset: "vercel" }),
        ]
      : []),
    viteReact(),
  ],
}));
