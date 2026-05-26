import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        // gray-matter ships an eval() path for CoffeeScript/TOML engines which
        // we never invoke — suppress this known false-positive until md-fusion
        // v0.2.1 (which swaps gray-matter for js-yaml) lands on the registry.
        if (
          warning.code === 'EVAL' &&
          warning.id?.includes('gray-matter')
        ) return;
        defaultHandler(warning);
      }
    }
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'Migrator',
        short_name: 'Migrator',
        description: 'Universal Note Converter. Private, Offline, Fast.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        // This regex tells the PWA: "If the URL starts with /wiki, do NOT hijack it."
        navigateFallbackDenylist: [/^\/wiki/, /^\/google-/, /^\/notion-/, /^\/enex-/, /^\/markdown-/, /^\/json-/]
      }
    })
  ]
});