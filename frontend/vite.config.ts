import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: 'Jak Sec',
        short_name: 'JakSec',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // workbox options for generateSW
        globPatterns: ['**/*.{js,css,html,png,jpg}'], // patterns to determine the files to be cached
        skipWaiting: true, 
        clientsClaim: true,
      },
    }),
  ],
})

