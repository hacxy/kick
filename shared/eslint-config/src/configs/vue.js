import vuePlugin from 'eslint-plugin-vue'

/** @type {import('eslint').Linter.Config[]} */
export const vueConfig = [
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
