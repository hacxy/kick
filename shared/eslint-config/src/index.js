import { baseConfig } from './configs/base.js'
import { libConfig } from './configs/lib.js'
import { nodeConfig } from './configs/node.js'
import { reactConfig } from './configs/react.js'
import { vueConfig } from './configs/vue.js'

/**
 * @typedef {Object} HacxyConfigOptions
 * @property {boolean} [react=false] - 启用 React 规则
 * @property {boolean} [vue=false] - 启用 Vue 规则
 * @property {boolean} [node=false] - 启用 Node.js 规则
 * @property {boolean} [lib=false] - 启用库开发规则
 */

/**
 * @param {HacxyConfigOptions} [options={}]
 * @returns {import('eslint').Linter.Config[]}
 */
export function hacxy(options = {}) {
  const configs = [...baseConfig]

  if (options.react) {
    if (reactConfig.length === 0) {
      console.error(
        '[@hacxy/eslint-config] react: true 已启用，但未安装 eslint-plugin-react / eslint-plugin-react-hooks',
      )
    }
    configs.push(...reactConfig)
  }

  if (options.vue) {
    if (vueConfig.length === 0) {
      console.error('[@hacxy/eslint-config] vue: true 已启用，但未安装 eslint-plugin-vue')
    }
    configs.push(...vueConfig)
  }

  if (options.node) {
    configs.push(...nodeConfig)
  }

  if (options.lib) {
    configs.push(...libConfig)
  }

  return configs
}

export default hacxy
