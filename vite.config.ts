import translations from '@pitininja/vite-translations';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const env = loadEnv('dev', process.cwd());

export default defineConfig({
    plugins: [
        react(),
        translations({
            dir: './src/lang'
        })
    ],
    define: {
        'import.meta.env.VITE_WEB_VERSION': JSON.stringify(
            process.env.npm_package_version
        )
    },
    css: {
        modules: {
            localsConvention: 'camelCaseOnly'
        }
    },
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
