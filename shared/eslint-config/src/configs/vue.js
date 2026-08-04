import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

/** @type {import('eslint').Linter.Plugin | null} */
let vuePlugin = null

try {
  vuePlugin = require('eslint-plugin-vue')
} catch {
  // 可选 peer 依赖未安装，Vue 规则由 index.js 在使用时提示
}

/** @type {import('eslint').Linter.Config[]} */
export const vueConfig = vuePlugin
  ? [
      // Vue 规则
      ...vuePlugin.configs['flat/recommended'],
      {
        files: ['*.vue', '**/*.vue'],
        rules: {
          'vue/multi-word-component-names': 'off',
          'vue/no-v-html': 'off',
          'vue/require-default-prop': 'off',
          'vue/require-explicit-emits': 'off',
        },
      },
    ]
  : []
