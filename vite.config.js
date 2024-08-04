import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                jobs: resolve(__dirname, 'examples/jobs-html/index.html'),
            },
        },
    },
});
