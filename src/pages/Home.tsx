import { ArrowRight, Terminal, Settings, Package } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Kick</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          项目脚手架 CLI 工具，快速创建标准化项目
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            查看模板
            <ArrowRight size={18} />
          </Link>
          <a
            href="https://github.com/hacxy/kick"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Quick Start */}
      <section className="bg-white rounded-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">快速开始</h2>
        <div className="bg-gray-900 rounded-lg p-6 text-green-400 font-mono">
          <p className="text-gray-400 mb-2"># 创建 React 项目</p>
          <p>npx @hacxy/kick new react my-app</p>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">功能特性</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={Terminal}
            title="CLI 工具"
            description="一条命令创建标准化项目，内置最佳实践"
          />
          <FeatureCard
            icon={Settings}
            title="共享配置"
            description="统一的 TypeScript、ESLint、Prettier 配置"
          />
          <FeatureCard
            icon={Package}
            title="模板系统"
            description="支持 React、Vue、Next.js 等多种模板"
          />
        </div>
      </section>

      {/* Templates Preview */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">可用模板</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TemplateCard
            name="react"
            description="React 19 + Vite + TypeScript + Tailwind CSS"
            category="前端"
          />
          <TemplateCard
            name="vue"
            description="Vue 3 + Vite + TypeScript + UnoCSS"
            category="前端"
          />
          <TemplateCard
            name="next"
            description="Next.js 15 + TypeScript + Tailwind CSS"
            category="全栈"
          />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
        <Icon size={24} className="text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function TemplateCard({
  name,
  description,
  category,
}: {
  name: string
  description: string
  category: string
}) {
  return (
    <Link
      to={`/templates?template=${name}`}
      className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{category}</span>
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
    </Link>
  )
}
