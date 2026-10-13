import { playwright } from '@vitest/browser-playwright';
import wyw from '@wyw-in-js/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Заранее, иначе Vite находит зависимость посреди прогона, пересобирает зависимости и хуки падают.
  optimizeDeps: { include: ['react', 'react/jsx-runtime', 'react-dom/client', 'vitest-browser-react', '@floating-ui/react', '@linaria/react'] },
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        plugins: [wyw({ include: ['**/*.tsx'] })],
        test: {
          name: 'components',
          include: ['src/**/*.test.tsx'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'package',
          include: ['test/**/*.test.ts'],
          environment: 'node',
          testTimeout: 120_000,
          hookTimeout: 120_000,
        },
      },
    ],
  },
});
