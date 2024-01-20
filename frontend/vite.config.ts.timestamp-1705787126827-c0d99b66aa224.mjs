// vite.config.ts
import react from "file:///H:/inde/JakSurveillance/frontend/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { defineConfig } from "file:///H:/inde/JakSurveillance/frontend/node_modules/vite/dist/node/index.js";
import { VitePWA } from "file:///H:/inde/JakSurveillance/frontend/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    // Use the React plugin with SWC
    react(),
    // Use the PWA plugin
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        // Set the name of the PWA
        name: "Jak Sec",
        // Set the short name of the PWA
        short_name: "JakSec",
        // Set the theme color of the PWA
        theme_color: "#ffffff",
        icons: [
          {
            // Define a 192x192 icon for the PWA
            src: "/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            // Define a 512x512 icon for the PWA
            src: "/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        // Define Workbox options for generateSW
        // Set patterns to determine the files to be cached
        globPatterns: ["**/*.{js,css,html,png,jpg}"],
        // Skip waiting, meaning the service worker will take over the page as soon as it's activated
        skipWaiting: true,
        // Claim clients, meaning the service worker will take control of all pages under its scope immediately
        clientsClaim: true,
        // Clean up outdated caches
        cleanupOutdatedCaches: true
      }
    })
  ],
  build: {
    // Use esbuild for minification during the build process
    minify: "esbuild"
  },
  esbuild: {
    // Remove console and debugger statements during the build process
    drop: ["console", "debugger"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJIOlxcXFxpbmRlXFxcXEpha1N1cnZlaWxsYW5jZVxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiSDpcXFxcaW5kZVxcXFxKYWtTdXJ2ZWlsbGFuY2VcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0g6L2luZGUvSmFrU3VydmVpbGxhbmNlL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XG5pbXBvcnQge2RlZmluZUNvbmZpZ30gZnJvbSAndml0ZSc7XG5pbXBvcnQge1ZpdGVQV0F9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XG5cbi8vIERlZmluZSB0aGUgVml0ZSBjb25maWd1cmF0aW9uXG4vLyBTZWUgaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy8gZm9yIG1vcmUgZGV0YWlsc1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0cGx1Z2luczogW1xuXHRcdC8vIFVzZSB0aGUgUmVhY3QgcGx1Z2luIHdpdGggU1dDXG5cdFx0cmVhY3QoKSxcblx0XHQvLyBVc2UgdGhlIFBXQSBwbHVnaW5cblx0XHRWaXRlUFdBKHtcblx0XHRcdFxuXHRcdFx0cmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXG5cblx0XHRcdG1hbmlmZXN0OiB7XG5cdFx0XHRcdC8vIFNldCB0aGUgbmFtZSBvZiB0aGUgUFdBXG5cdFx0XHRcdG5hbWU6ICdKYWsgU2VjJyxcblx0XHRcdFx0Ly8gU2V0IHRoZSBzaG9ydCBuYW1lIG9mIHRoZSBQV0Fcblx0XHRcdFx0c2hvcnRfbmFtZTogJ0pha1NlYycsXG5cdFx0XHRcdC8vIFNldCB0aGUgdGhlbWUgY29sb3Igb2YgdGhlIFBXQVxuXHRcdFx0XHR0aGVtZV9jb2xvcjogJyNmZmZmZmYnLFxuXHRcdFx0XHRpY29uczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdC8vIERlZmluZSBhIDE5MngxOTIgaWNvbiBmb3IgdGhlIFBXQVxuXHRcdFx0XHRcdFx0c3JjOiAnL2ljb25zL2FuZHJvaWQtY2hyb21lLTE5MngxOTIucG5nJyxcblx0XHRcdFx0XHRcdHNpemVzOiAnMTkyeDE5MicsXG5cdFx0XHRcdFx0XHR0eXBlOiAnaW1hZ2UvcG5nJyxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdC8vIERlZmluZSBhIDUxMng1MTIgaWNvbiBmb3IgdGhlIFBXQVxuXHRcdFx0XHRcdFx0c3JjOiAnL2ljb25zL2FuZHJvaWQtY2hyb21lLTUxMng1MTIucG5nJyxcblx0XHRcdFx0XHRcdHNpemVzOiAnNTEyeDUxMicsXG5cdFx0XHRcdFx0XHR0eXBlOiAnaW1hZ2UvcG5nJyxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRdLFxuXHRcdFx0fSxcblx0XHRcdHdvcmtib3g6IHtcblx0XHRcdFx0Ly8gRGVmaW5lIFdvcmtib3ggb3B0aW9ucyBmb3IgZ2VuZXJhdGVTV1xuXHRcdFx0XHQvLyBTZXQgcGF0dGVybnMgdG8gZGV0ZXJtaW5lIHRoZSBmaWxlcyB0byBiZSBjYWNoZWRcblx0XHRcdFx0Z2xvYlBhdHRlcm5zOiBbJyoqLyoue2pzLGNzcyxodG1sLHBuZyxqcGd9J10sXG5cdFx0XHRcdC8vIFNraXAgd2FpdGluZywgbWVhbmluZyB0aGUgc2VydmljZSB3b3JrZXIgd2lsbCB0YWtlIG92ZXIgdGhlIHBhZ2UgYXMgc29vbiBhcyBpdCdzIGFjdGl2YXRlZFxuXHRcdFx0XHRza2lwV2FpdGluZzogdHJ1ZSxcblx0XHRcdFx0Ly8gQ2xhaW0gY2xpZW50cywgbWVhbmluZyB0aGUgc2VydmljZSB3b3JrZXIgd2lsbCB0YWtlIGNvbnRyb2wgb2YgYWxsIHBhZ2VzIHVuZGVyIGl0cyBzY29wZSBpbW1lZGlhdGVseVxuXHRcdFx0XHRjbGllbnRzQ2xhaW06IHRydWUsXG5cdFx0XHRcdC8vIENsZWFuIHVwIG91dGRhdGVkIGNhY2hlc1xuXHRcdFx0XHRjbGVhbnVwT3V0ZGF0ZWRDYWNoZXM6IHRydWUsXG5cdFx0XHR9LFxuXHRcdH0pLFxuXHRdLFxuXG5cdGJ1aWxkOiB7XG5cdFx0Ly8gVXNlIGVzYnVpbGQgZm9yIG1pbmlmaWNhdGlvbiBkdXJpbmcgdGhlIGJ1aWxkIHByb2Nlc3Ncblx0XHRtaW5pZnk6ICdlc2J1aWxkJyxcblx0fSxcblx0ZXNidWlsZDoge1xuXHRcdC8vIFJlbW92ZSBjb25zb2xlIGFuZCBkZWJ1Z2dlciBzdGF0ZW1lbnRzIGR1cmluZyB0aGUgYnVpbGQgcHJvY2Vzc1xuXHRcdGRyb3A6IFsnY29uc29sZScsICdkZWJ1Z2dlciddLFxuXHR9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBSLE9BQU8sV0FBVztBQUM1UyxTQUFRLG9CQUFtQjtBQUMzQixTQUFRLGVBQWM7QUFJdEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsU0FBUztBQUFBO0FBQUEsSUFFUixNQUFNO0FBQUE7QUFBQSxJQUVOLFFBQVE7QUFBQSxNQUVQLGNBQWM7QUFBQSxNQUVkLFVBQVU7QUFBQTtBQUFBLFFBRVQsTUFBTTtBQUFBO0FBQUEsUUFFTixZQUFZO0FBQUE7QUFBQSxRQUVaLGFBQWE7QUFBQSxRQUNiLE9BQU87QUFBQSxVQUNOO0FBQUE7QUFBQSxZQUVDLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNQO0FBQUEsVUFDQTtBQUFBO0FBQUEsWUFFQyxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUDtBQUFBLFFBQ0Q7QUFBQSxNQUNEO0FBQUEsTUFDQSxTQUFTO0FBQUE7QUFBQTtBQUFBLFFBR1IsY0FBYyxDQUFDLDRCQUE0QjtBQUFBO0FBQUEsUUFFM0MsYUFBYTtBQUFBO0FBQUEsUUFFYixjQUFjO0FBQUE7QUFBQSxRQUVkLHVCQUF1QjtBQUFBLE1BQ3hCO0FBQUEsSUFDRCxDQUFDO0FBQUEsRUFDRjtBQUFBLEVBRUEsT0FBTztBQUFBO0FBQUEsSUFFTixRQUFRO0FBQUEsRUFDVDtBQUFBLEVBQ0EsU0FBUztBQUFBO0FBQUEsSUFFUixNQUFNLENBQUMsV0FBVyxVQUFVO0FBQUEsRUFDN0I7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
