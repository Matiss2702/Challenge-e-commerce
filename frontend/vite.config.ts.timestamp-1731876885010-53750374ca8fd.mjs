// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///home/node/node_modules/vite/dist/node/index.js";
import vue from "file:///home/node/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///home/node/node_modules/unplugin-vue-components/dist/vite.js";
var __vite_injected_original_import_meta_url = "file:///home/node/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ["src/components"]
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  server: {
    host: "0.0.0.0",
    port: 8e3,
    // Assurez-vous que le port ne rentre pas en conflit avec d'autres applications
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        // URL de votre API backend
        changeOrigin: true,
        secure: false
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9ub2RlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9ub2RlL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL25vZGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG5cdHBsdWdpbnM6IFtcclxuXHRcdHZ1ZSgpLFxyXG5cdFx0Q29tcG9uZW50cyh7XHJcblx0XHRcdGRpcnM6IFtcInNyYy9jb21wb25lbnRzXCJdXHJcblx0XHR9KSxcclxuXHRdLFxyXG5cdHJlc29sdmU6IHtcclxuXHRcdGFsaWFzOiB7XHJcblx0XHRcdCdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXHJcblx0XHR9LFxyXG5cdH0sXHJcblx0c2VydmVyOiB7XHJcblx0XHRob3N0OiBcIjAuMC4wLjBcIixcclxuXHRcdHBvcnQ6IDgwMDAsIC8vIEFzc3VyZXotdm91cyBxdWUgbGUgcG9ydCBuZSByZW50cmUgcGFzIGVuIGNvbmZsaXQgYXZlYyBkJ2F1dHJlcyBhcHBsaWNhdGlvbnNcclxuXHRcdHByb3h5OiB7XHJcblx0XHRcdCcvYXBpJzoge1xyXG5cdFx0XHRcdHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcsIC8vIFVSTCBkZSB2b3RyZSBBUEkgYmFja2VuZFxyXG5cdFx0XHRcdGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuXHRcdFx0XHRzZWN1cmU6IGZhbHNlLFxyXG5cdFx0XHR9LFxyXG5cdFx0fSxcclxuXHR9XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdOLFNBQVMsZUFBZSxXQUFXO0FBQ25QLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLGdCQUFnQjtBQUhxRyxJQUFNLDJDQUEyQztBQU03SyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixTQUFTO0FBQUEsSUFDUixJQUFJO0FBQUEsSUFDSixXQUFXO0FBQUEsTUFDVixNQUFNLENBQUMsZ0JBQWdCO0FBQUEsSUFDeEIsQ0FBQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNSLE9BQU87QUFBQSxNQUNOLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDckQ7QUFBQSxFQUNEO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNOLFFBQVE7QUFBQSxRQUNQLFFBQVE7QUFBQTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLE1BQ1Q7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUNELENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
