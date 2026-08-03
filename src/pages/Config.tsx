import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface ConfigOption {
  key: string
  value: string
  description: string
}

const configs: Record<string, { title: string; options: ConfigOption[] }> = {
  tsconfig: {
    title: '@hacxy/tsconfig',
    options: [
      { key: 'target', value: 'ES2022', description: '编译目标版本' },
      { key: 'module', value: 'ESNext', description: '模块系统' },
      { key: 'moduleResolution', value: 'bundler', description: '模块解析策略' },
      { key: 'strict', value: 'true', description: '启用所有严格类型检查' },
      { key: 'esModuleInterop', value: 'true', description: '启用 ES 模块互操作' },
      { key: 'skipLibCheck', value: 'true', description: '跳过库文件类型检查' },
      {
        key: 'forceConsistentCasingInFileNames',
        value: 'true',
        description: '强制文件名大小写一致',
      },
      { key: 'resolveJsonModule', value: 'true', description: '允许导入 JSON 模块' },
      { key: 'isolatedModules', value: 'true', description: '确保每个文件都能独立编译' },
      { key: 'verbatimModuleSyntax', value: 'true', description: '强制使用 import type 导入类型' },
      { key: 'noUncheckedIndexedAccess', value: 'true', description: '索引访问返回 T | undefined' },
    ],
  },
  eslint: {
    title: '@hacxy/eslint-config',
    options: [
      { key: '@eslint/js', value: 'recommended', description: 'ESLint 推荐规则' },
      { key: 'typescript-eslint', value: 'recommended', description: 'TypeScript 规则' },
      { key: '@stylistic/eslint-plugin', value: 'enabled', description: '代码风格规则' },
      { key: 'eslint-plugin-perfectionist', value: 'enabled', description: '排序规则' },
      { key: 'eslint-plugin-unicorn', value: 'enabled', description: '最佳实践规则' },
      { key: 'eslint-plugin-unused-imports', value: 'enabled', description: '未使用 import 检测' },
      { key: 'eslint-config-prettier', value: 'enabled', description: 'Prettier 兼容' },
    ],
  },
  prettier: {
    title: '@hacxy/prettier-config',
    options: [
      { key: 'semi', value: 'false', description: '不使用分号' },
      { key: 'singleQuote', value: 'true', description: '使用单引号' },
      { key: 'tabWidth', value: '2', description: '缩进空格数' },
      { key: 'trailingComma', value: 'all', description: '尾逗号' },
      { key: 'printWidth', value: '100', description: '行宽限制' },
      { key: 'arrowParens', value: 'always', description: '箭头函数参数括号' },
      { key: 'bracketSpacing', value: 'true', description: '括号空格' },
      { key: 'endOfLine', value: 'lf', description: '换行符' },
    ],
  },
}

const usageExamples: Record<string, string> = {
  tsconfig: `// tsconfig.json
{
  "extends": "@hacxy/tsconfig/react.json"
}`,
  eslint: `// eslint.config.js
import { hacxy } from '@hacxy/eslint-config'

export default hacxy({
  react: true
})`,
  prettier: `// .prettierrc
"@hacxy/prettier-config"`,
}

export function Config() {
  const [activeTab, setActiveTab] = useState('tsconfig')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const currentConfig = configs[activeTab]

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(`${key}: ${value}`)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  if (!currentConfig) {
    return null
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">配置查看</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        {Object.entries(configs).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === key
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {config.title}
          </button>
        ))}
      </div>

      {/* Config Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">配置项</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">值</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">说明</th>
              <th className="w-12 px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {currentConfig.options.map((option) => (
              <tr key={option.key} className="border-b border-gray-100 last:border-0">
                <td className="px-6 py-4">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded text-blue-600">
                    {option.key}
                  </code>
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm bg-green-50 px-2 py-1 rounded text-green-700">
                    {option.value}
                  </code>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{option.description}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleCopy(option.key, option.value)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="复制"
                  >
                    {copiedKey === option.key ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Usage Example */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">使用方式</h3>
        <pre className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
          {usageExamples[activeTab]}
        </pre>
      </div>
    </div>
  )
}
