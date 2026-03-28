import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: "injectManifest", // ✅ REQUIRED for push
      srcDir: "src",
      filename: "sw.js",

      registerType: "autoUpdate",

      devOptions: {
        enabled: true, // ✅ IMPORTANT (this is why dev shows 404)
      },

      manifest: {
        name: "CineWish",
        short_name: "CineWish",
        theme_color: "#000000",
        icons: [
          {
            src: "logo/pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "logo/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "logo/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
