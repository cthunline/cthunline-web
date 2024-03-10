import { loadEnv, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

const env = loadEnv('dev', process.cwd());

export default defineConfig({
    plugins: [react(), svgr()],
    server: {
        port: 3030,
        open: true,
        proxy: {
            '/api': {
                target: env.VITE_DEV_API_URL,
                changeOrigin: true,
                secure: false
            },
            '/socket.io': {
                target: env.VITE_DEV_API_URL,
                secure: false,
                ws: true
            },
            '/static': {
                target: env.VITE_DEV_API_URL,
                changeOrigin: true,
                secure: false
            }
        }
    }
});
