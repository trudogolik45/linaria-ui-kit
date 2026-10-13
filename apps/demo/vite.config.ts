import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// На GitHub Pages сайт живёт в подпапке с именем репозитория.
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/linaria-ui-kit/' : '/',
  plugins: [react()],
});
