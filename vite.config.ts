import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// base "./" => funciona em GitHub Pages (projeto) e em qualquer subpasta.
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["img/logo.png", "img/icon-192.png", "img/icon-512.png"],
      manifest: {
        name: "Paulex Armarinho",
        short_name: "Paulex",
        description:
          "Papelaria, utilidades, informática, brinquedos, cosméticos e descartáveis. Atacado e varejo desde 1984.",
        lang: "pt-BR",
        start_url: "./",
        scope: "./",
        display: "standalone",
        orientation: "portrait",
        background_color: "#FFFFFF",
        theme_color: "#002D8F",
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
            options: { cacheName: "google-fonts", expiration: { maxEntries: 20 } },
          },
        ],
      },
    }),
  ],
});
