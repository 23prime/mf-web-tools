import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing';

export default defineConfig({
  plugins: [
    WxtVitest({
      wxtConfigPath: './wxt.config.ts',
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    // Remove setupFiles - WxtVitest auto-mocks Chrome APIs
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/',
        '**/.output/',
        '**/.wxt/',
      ],
    },
  },
});
