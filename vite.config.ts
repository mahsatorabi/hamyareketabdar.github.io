import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: '', // این خط را اضافه کنید
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'کتابخانه من',
        short_name: 'کتابخانه',
        start_url: '#', // این خط را هم اصلاح کنید
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2563eb',
        icons: [
          {
            src: '/ketabbase.github.io/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/ketabbase.github.io/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));