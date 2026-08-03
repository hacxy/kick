import { Play, Code } from 'lucide-react'
import { useState } from 'react'

interface Template {
  name: string
  category: string
  description: string
  techStack: string[]
  command: string
}

const templates: Template[] = [
  {
    name: 'react',
    category: 'frontend',
    description: 'React 19 + Vite + TypeScript + Tailwind CSS',
    techStack: ['React', 'Vite', 'TypeScript', 'Tailwind CSS'],
    command: 'npx @hacxy/kick new react my-app',
  },
  {
    name: 'vue',
    category: 'frontend',
    description: 'Vue 3 + Vite + TypeScript + UnoCSS',
    techStack: ['Vue', 'Vite', 'TypeScript', 'UnoCSS'],
    command: 'npx @hacxy/kick new vue my-app',
  },
  {
    name: 'next',
    category: 'fullstack',
    description: 'Next.js 15 + TypeScript + Tailwind CSS',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    command: 'npx @hacxy/kick new next my-app',
  },
  {
    name: 'express',
    category: 'backend',
    description: 'Express + TypeScript',
    techStack: ['Express', 'TypeScript', 'Node.js'],
    command: 'npx @hacxy/kick new express my-api',
  },
  {
    name: 'library',
    category: 'others',
    description: 'TypeScript + tsup + Vitest',
    techStack: ['TypeScript', 'tsup', 'Vitest'],
    command: 'npx @hacxy/kick new library my-lib',
  },
]

const categoryLabels: Record<string, string> = {
  frontend: '前端',
  fullstack: '全栈',
  backend: '后端',
  others: '其他',
}

const categoryColors: Record<string, string> = {
  frontend: 'bg-blue-100 text-blue-700',
  fullstack: 'bg-purple-100 text-purple-700',
  backend: 'bg-green-100 text-green-700',
  others: 'bg-gray-100 text-gray-700',
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">模板展示</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List */}
        <div className="lg:col-span-2 space-y-4">
          {templates.map((template) => (
            <div
              key={template.name}
              className={`bg-white rounded-xl border p-6 cursor-pointer transition-all ${
                selectedTemplate?.name === template.name
                  ? 'border-blue-500 shadow-md'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded ${categoryColors[template.category]}`}
                    >
                      {categoryLabels[template.category]}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{template.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {template.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Template Detail */}
        <div className="lg:col-span-1">
          {selectedTemplate ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedTemplate.name} 模板
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">分类</p>
                  <p className="text-gray-900">{categoryLabels[selectedTemplate.category]}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">描述</p>
                  <p className="text-gray-900">{selectedTemplate.description}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">技术栈</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">创建命令</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-900 text-green-400 px-3 py-2 rounded text-sm font-mono">
                      {selectedTemplate.command}
                    </code>
                    <button
                      onClick={() => handleCopy(selectedTemplate.command)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="复制"
                    >
                      {copied ? (
                        <span className="text-green-500 text-sm">已复制</span>
                      ) : (
                        <Code size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleCopy(selectedTemplate.command)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Play size={18} />
                    复制命令
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center text-gray-500">
              选择一个模板查看详情
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
