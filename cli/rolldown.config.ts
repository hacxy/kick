import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm',
    minify: true,
  },
  external: [
    'cac',
    'chalk',
    'inquirer',
    'ora',
    'undici',
    'degit',
    'fs',
    'path',
    'os',
    'child_process',
    'url',
    'util',
  ],
})
