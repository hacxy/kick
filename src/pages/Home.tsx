import { ArrowRight, Settings, Package } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import './Home.css'

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
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          {/* Main Title */}
          <h1 className="hero-title">kick</h1>

          <p className="hero-subtitle">
            项目脚手架 CLI 工具
            <br />
            <span>一条命令，标准化项目结构</span>
          </p>

          {/* Terminal Demo */}
          <div className="terminal-block terminal-wrapper">
            <div className="terminal-header">
              <div className="terminal-dot terminal-dot-red"></div>
              <div className="terminal-dot terminal-dot-yellow"></div>
              <div className="terminal-dot terminal-dot-green"></div>
              <span className="terminal-label">terminal</span>
            </div>
            <div className="terminal-content">
              <span className="code-comment"># 创建项目</span>
              <br />
              <span className="code-key">{typedText}</span>
              <span className="cursor-blink">▊</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="cta-buttons">
            <Link to="/templates" className="cta-primary">
              <Package size={16} />
              查看模板
              <ArrowRight size={16} />
            </Link>
            <Link to="/config" className="cta-secondary">
              <Settings size={16} />
              查看配置
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
