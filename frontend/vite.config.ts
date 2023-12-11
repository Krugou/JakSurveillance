import react from '@vitejs/plugin-react-swc';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

// Define the Vite configuration
// See https://vitejs.dev/config/ for more details
export default defineConfig({
	plugins: [
		// Use the React plugin with SWC
		react(),
		// Use the PWA plugin
		VitePWA({
			manifest: {
				// Set the name of the PWA
				name: 'Jak Sec',
				// Set the short name of the PWA
				short_name: 'JakSec',
				// Set the theme color of the PWA
				theme_color: '#ffffff',
				icons: [
					{
						// Define a 192x192 icon for the PWA
						src: '/icons/android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						// Define a 512x512 icon for the PWA
						src: '/icons/android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
				],
			},
			workbox: {
				// Define Workbox options for generateSW
				// Set patterns to determine the files to be cached
				globPatterns: ['**/*.{js,css,html,png,jpg}'],
				// Skip waiting, meaning the service worker will take over the page as soon as it's activated
				skipWaiting: true,
				// Claim clients, meaning the service worker will take control of all pages under its scope immediately
				clientsClaim: true,
				// Clean up outdated caches
				cleanupOutdatedCaches: true,
			},
		}),
	],
	build: {
		minify: 'terser',
		terserOptions: {
			output: {
				comments: false,
			},
			compress: {
				drop_console: true,
			},
		},
	},
});
