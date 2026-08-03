import { Home, Settings, Package, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/config', label: '配置', icon: Settings },
  { path: '/templates', label: '模板', icon: Package },
]

export function Layout() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(8px)',
          background: 'rgba(13, 13, 20, 0.9)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '4rem',
            }}
          >
            {/* Logo */}
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  background: 'var(--color-accent)',
                  color: 'var(--color-bg)',
                }}
              >
                K
              </div>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  letterSpacing: '-0.025em',
                  fontFamily: "'JetBrains Mono', monospace",
                  color: 'var(--color-text)',
                }}
              >
                kick
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      fontFamily: "'JetBrains Mono', monospace",
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                      background: isActive ? 'rgba(196, 248, 42, 0.1)' : 'transparent',
                    }}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* GitHub Link */}
            <a
              href="https://github.com/hacxy/kick"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              GitHub
            </a>

            {/* Mobile Menu Button */}
            <button
              style={{
                display: 'none',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                color: 'var(--color-text-muted)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          marginTop: '5rem',
          padding: '2rem 0',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'var(--color-text-muted)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <p style={{ fontFamily: "'JetBrains Mono', monospace" }}>kick · 项目脚手架 CLI</p>
      </footer>
    </div>
  )
}
