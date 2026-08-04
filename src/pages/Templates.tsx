import { Copy, Check, ArrowRight } from 'lucide-react'
import { useState } from 'react'

import templates from '../data/templates.json'

interface Template {
  name: string
  category: string
  description: string
  techStack: string[]
  command: string
}

const categoryLabels: Record<string, string> = {
  frontend: '前端',
  fullstack: '全栈',
  backend: '后端',
  others: '其他',
}

export function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = (command: string) => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
          模板展示
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>选择模板创建项目</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Template List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {templates.map((template) => (
            <div
              key={template.name}
              className="card"
              style={{
                padding: '1.5rem',
                cursor: 'pointer',
                borderColor:
                  selectedTemplate?.name === template.name
                    ? 'var(--color-accent)'
                    : 'var(--color-border)',
              }}
              onClick={() => setSelectedTemplate(template)}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        fontFamily: "'JetBrains Mono', monospace",
                        color: 'var(--color-text)',
                      }}
                    >
                      {template.name}
                    </h3>
                    <span className={`tag tag-${template.category}`}>
                      {categoryLabels[template.category]}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      marginBottom: '1rem',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {template.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {template.techStack.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          background: 'var(--color-bg)',
                          color: 'var(--color-text-muted)',
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight
                  size={20}
                  style={{
                    color:
                      selectedTemplate?.name === template.name
                        ? 'var(--color-accent)'
                        : 'var(--color-text-muted)',
                    transition: 'color 0.2s',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Template Detail */}
        <div>
          {selectedTemplate ? (
            <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '6rem' }}>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  marginBottom: '1.5rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  color: 'var(--color-text)',
                }}
              >
                {selectedTemplate.name} 模板
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      marginBottom: '0.5rem',
                      color: 'var(--color-text-muted)',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    分类
                  </p>
                  <p style={{ color: 'var(--color-text)' }}>
                    {categoryLabels[selectedTemplate.category]}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      marginBottom: '0.5rem',
                      color: 'var(--color-text-muted)',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    描述
                  </p>
                  <p style={{ color: 'var(--color-text)' }}>{selectedTemplate.description}</p>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      marginBottom: '0.5rem',
                      color: 'var(--color-text-muted)',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    技术栈
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedTemplate.techStack.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          background: 'rgba(196, 248, 42, 0.1)',
                          color: 'var(--color-accent)',
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      marginBottom: '0.5rem',
                      color: 'var(--color-text-muted)',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    创建命令
                  </p>
                  <div className="terminal-block">
                    <div className="terminal-header">
                      <div className="terminal-dot terminal-dot-red"></div>
                      <div className="terminal-dot terminal-dot-yellow"></div>
                      <div className="terminal-dot terminal-dot-green"></div>
                    </div>
                    <div className="terminal-content" style={{ fontSize: '0.875rem' }}>
                      <span className="code-key">{selectedTemplate.command}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(selectedTemplate.command)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    fontFamily: "'JetBrains Mono', monospace",
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: 'var(--color-accent)',
                    color: 'var(--color-bg)',
                    border: 'none',
                  }}
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      复制命令
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <p
                style={{
                  color: 'var(--color-text-muted)',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                选择一个模板查看详情
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
