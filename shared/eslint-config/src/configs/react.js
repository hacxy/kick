import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

/** @type {import('eslint').Linter.Plugin | null} */
let reactPlugin = null
/** @type {import('eslint').Linter.Plugin | null} */
let reactHooksPlugin = null

try {
  reactPlugin = require('eslint-plugin-react')
  reactHooksPlugin = require('eslint-plugin-react-hooks')
} catch {
  // 可选 peer 依赖未安装，React 规则由 index.js 在使用时提示
}

/** @type {import('eslint').Linter.Config[]} */
export const reactConfig =
  reactPlugin && reactHooksPlugin
    ? [
        // React 规则
        {
          plugins: {
            react: reactPlugin,
          },
          languageOptions: {
            parserOptions: {
              ecmaFeatures: {
                jsx: true,
              },
            },
          },
          settings: {
            react: {
              version: 'detect',
            },
          },
          rules: {
            ...reactPlugin.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/display-name': 'off',
          },
        },

        // React Hooks 规则
        {
          plugins: {
            'react-hooks': reactHooksPlugin,
          },
          rules: {
            ...reactHooksPlugin.configs.recommended.rules,
          },
        },
      ]
    : []
