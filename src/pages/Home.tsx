import { ArrowRight, Terminal, Zap, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const commands = [
  '$ npx @hacxy/kick new react my-app',
  '$ npx @hacxy/kick new vue my-app',
  '$ npx @hacxy/kick new next my-app',
]

export function Home() {
  const [typedText, setTypedText] = useState('')
  const [commandIndex, setCommandIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    const currentCommand = commands[commandIndex]
    if (currentCommand && charIndex < currentCommand.length) {
      const timer = setTimeout(() => {
        setTypedText(currentCommand.slice(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      }, 50)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setCharIndex(0)
        setTypedText('')
        setCommandIndex((commandIndex + 1) % commands.length)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [charIndex, commandIndex])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
      {/* Hero Section */}
      <section style={{ paddingTop: '5rem', paddingBottom: '2.5rem' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              marginBottom: '2rem',
              background: 'rgba(196, 248, 42, 0.1)',
              color: 'var(--color-accent)',
              border: '1px solid rgba(196, 248, 42, 0.2)',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <Zap size={14} />
            v0.8.0
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: 'clamp(3.75rem, 8vw, 6rem)',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              letterSpacing: '-0.025em',
              fontFamily: "'JetBrains Mono', monospace",
              color: 'var(--color-accent)',
            }}
          >
            kick
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
              marginBottom: '3rem',
              maxWidth: '42rem',
              margin: '0 auto 3rem',
              color: 'var(--color-text-muted)',
            }}
          >
            项目脚手架 CLI 工具
            <br />
            <span style={{ fontSize: '1.125rem' }}>一条命令，标准化项目结构</span>
          </p>

          {/* Terminal Demo */}
          <div className="terminal-block" style={{ maxWidth: '42rem', margin: '0 auto 3rem' }}>
            <div className="terminal-header">
              <div className="terminal-dot terminal-dot-red"></div>
              <div className="terminal-dot terminal-dot-yellow"></div>
              <div className="terminal-dot terminal-dot-green"></div>
              <span
                style={{
                  marginLeft: '1rem',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-muted)',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                terminal
              </span>
            </div>
            <div className="terminal-content">
              <span className="code-comment"># 创建项目</span>
              <br />
              <span className="code-key">{typedText}</span>
              <span className="cursor-blink">▊</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
          >
            <Link
              to="/templates"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                fontFamily: "'JetBrains Mono', monospace",
                background: 'var(--color-accent)',
                color: 'var(--color-bg)',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              查看模板
              <ArrowRight size={16} />
            </Link>
            <a
              href="https://github.com/hacxy/kick"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                fontFamily: "'JetBrains Mono', monospace",
                color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2
            style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              fontFamily: "'JetBrains Mono', monospace",
              color: 'var(--color-text)',
            }}
          >
            为什么选择 <span style={{ color: 'var(--color-accent)' }}>kick</span>
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }}>内置最佳实践，开箱即用</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <FeatureCard
            icon={Terminal}
            title="标准化结构"
            description="统一的项目结构和代码规范，团队协作更高效"
          />
          <FeatureCard
            icon={Zap}
            title="快速启动"
            description="一条命令创建完整项目，无需手动配置"
          />
          <FeatureCard
            icon={Shield}
            title="最佳实践"
            description="内置 TypeScript、ESLint、Prettier 配置"
          />
        </div>
      </section>

      {/* Templates Section */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2
            style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              fontFamily: "'JetBrains Mono', monospace",
              color: 'var(--color-text)',
            }}
          >
            可用模板
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }}>支持主流技术栈</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <TemplateCard name="react" category="frontend" />
          <TemplateCard name="vue" category="frontend" />
          <TemplateCard name="next" category="fullstack" />
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
    <div className="card" style={{ padding: '1.5rem' }}>
      <div
        style={{
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          background: 'rgba(196, 248, 42, 0.1)',
        }}
      >
        <Icon size={20} className="text-accent" />
      </div>
      <h3
        style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          marginBottom: '0.5rem',
          fontFamily: "'JetBrains Mono', monospace",
          color: 'var(--color-text)',
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{description}</p>
    </div>
  )
}

function TemplateCard({ name, category }: { name: string; category: string }) {
  return (
    <Link
      to={`/templates?template=${name}`}
      className="card"
      style={{ padding: '1.5rem', textDecoration: 'none' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <span className={`tag tag-${category}`}>{category}</span>
      </div>
      <h3
        style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          marginBottom: '0.5rem',
          fontFamily: "'JetBrains Mono', monospace",
          color: 'var(--color-text)',
          transition: 'color 0.2s',
        }}
      >
        {name}
      </h3>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          color: 'var(--color-accent)',
          opacity: 0,
          transition: 'opacity 0.2s',
        }}
      >
        查看详情 <ArrowRight size={14} />
      </div>
    </Link>
  )
}
