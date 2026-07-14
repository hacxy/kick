import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/**/*.ts', '!./src/**/*.d.ts'],
  shims: true,
  format: ['esm'],
  clean: true,
  target: 'node18',
  sourcemap: false,
  declaration: false,
});
