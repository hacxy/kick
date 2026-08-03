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
  tsconfig: `{
  "extends": "@hacxy/tsconfig/react.json"
}`,
  eslint: `import { hacxy } from '@hacxy/eslint-config'

export default hacxy({
  react: true
})`,
  prettier: `"@hacxy/prettier-config"`,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1
          style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            fontFamily: "'JetBrains Mono', monospace",
            color: 'var(--color-text)',
          }}
        >
          配置查看
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>查看共享配置包的详细配置</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {Object.entries(configs).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: activeTab === key ? 'var(--color-accent)' : 'var(--color-bg-elevated)',
              color: activeTab === key ? 'var(--color-bg)' : 'var(--color-text-muted)',
              border: activeTab === key ? 'none' : '1px solid var(--color-border)',
            }}
          >
            {config.title}
          </button>
        ))}
      </div>

      {/* Config Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th
                style={{
                  textAlign: 'left',
                  padding: '1rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--color-text-muted)',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                配置项
              </th>
              <th
                style={{
                  textAlign: 'left',
                  padding: '1rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--color-text-muted)',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                值
              </th>
              <th
                style={{
                  textAlign: 'left',
                  padding: '1rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--color-text-muted)',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                说明
              </th>
              <th style={{ width: '3rem', padding: '1rem 1.5rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {currentConfig.options.map((option) => (
              <tr key={option.key} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <code
                    style={{
                      fontSize: '0.875rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      background: 'var(--color-bg)',
                      color: 'var(--color-accent)',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {option.key}
                  </code>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <code
                    style={{
                      fontSize: '0.875rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      background: 'rgba(107, 92, 231, 0.1)',
                      color: '#A78BFA',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {option.value}
                  </code>
                </td>
                <td
                  style={{
                    padding: '1rem 1.5rem',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {option.description}
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <button
                    onClick={() => handleCopy(option.key, option.value)}
                    style={{
                      padding: '0.25rem',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      color:
                        copiedKey === option.key
                          ? 'var(--color-accent)'
                          : 'var(--color-text-muted)',
                      background: 'transparent',
                      border: 'none',
                    }}
                    title="复制"
                  >
                    {copiedKey === option.key ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Usage Example */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            marginBottom: '1rem',
            fontFamily: "'JetBrains Mono', monospace",
            color: 'var(--color-text)',
          }}
        >
          使用方式
        </h3>
        <div className="terminal-block">
          <div className="terminal-header">
            <div className="terminal-dot terminal-dot-red"></div>
            <div className="terminal-dot terminal-dot-yellow"></div>
            <div className="terminal-dot terminal-dot-green"></div>
          </div>
          <pre
            className="terminal-content"
            style={{ overflow: 'auto', fontFamily: "'JetBrains Mono', monospace" }}
          >
            {usageExamples[activeTab]}
          </pre>
        </div>
      </div>
    </div>
  )
}
