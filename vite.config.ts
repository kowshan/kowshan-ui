import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    build: {
        // Every showcase page is its own chunk, so code-split CSS means a cold
        // visit to any page fetches a second stylesheet before it can paint
        // (the "unstyled at first" flash on slow connections). One stylesheet,
        // linked from index.html, is already there before the first paint.
        cssCodeSplit: false,
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '~': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        port: 3100,
    },
})
