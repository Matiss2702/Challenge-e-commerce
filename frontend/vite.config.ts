import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		Components({
			dirs: ["src/components"]
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		},
	},
	server: {
		host: "0.0.0.0",
		port: 8000, // Assurez-vous que le port ne rentre pas en conflit avec d'autres applications
		proxy: {
			'/api': {
				target: 'http://localhost:3000', // URL de votre API backend
				changeOrigin: true,
				secure: false,
			},
		},
	}
});
