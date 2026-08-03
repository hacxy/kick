import { defineConfig } from 'tsdown'

export default defineConfig({
  shims: true,
  format: ['esm'],
  clean: true,
  target: 'node18',
  sourcemap: false,
})
