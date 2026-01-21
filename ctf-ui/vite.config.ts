import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Get the repository name from environment variable or default to empty string
// For GitHub Pages: if repo is 'username.github.io', use '/', otherwise use '/repo-name/'
const repoName = process.env.VITE_REPO_NAME || '';
const base = repoName ? `/${repoName}/` : '/';

export default defineConfig({
  base: "/CTF_Demo_Repo/",
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Silence deprecation warnings from dependencies/tools (Dart Sass).
        // We also migrated our own SCSS to `@use` + `sass:color`.
        quietDeps: true,
        silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions'],
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
