import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.{test,spec}.{ts,js}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['commands/**/*.ts', 'services/**/*.ts', 'utils.ts', 'index.ts'],
      exclude: ['**/*.d.ts', '**/*.test.ts', '**/*.spec.ts', 'test/**'],
    },
  },
})
