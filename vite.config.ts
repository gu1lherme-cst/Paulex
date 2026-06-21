import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["img/logo.png", "img/icon-192.png", "img/icon-512.png"],
      manifest: {
        name: "Px - O sistema operacional do estudante",
        short_name: "Px",
        description:
          "Notas, tarefas, calendário, metas, Pomodoro, comunidade e IA para estudantes.",
        lang: "pt-BR",
        start_url: "./",
        scope: "./",
        display: "standalone",
        orientation: "portrait",
        background_color: "#FFFFFF",
        theme_color: "#0457ff",
        icons: [
          { src: "img/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "img/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "img/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 20 },
            },
          },
        ],
      },
    }),
  ],
});
