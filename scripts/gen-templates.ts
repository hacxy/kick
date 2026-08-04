import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(import.meta.dirname, '..')
const TEMPLATES_DIR = join(ROOT, 'templates')
const OUTPUT_FILE = join(ROOT, 'src/data/templates.json')

interface TemplateMeta {
  name: string
  category: string
  description: string
  techStack: string[]
  command: string
}

// 根据模板名称推断分类和技栈
function inferMeta(name: string, description: string): { category: string; techStack: string[] } {
  const desc = description.toLowerCase()

  // 从 description 中提取技栈
  const techStack = description.split('+').map((s) => s.trim())

  // 推断分类
  let category = 'others'
  if (desc.includes('react') || desc.includes('vue') || desc.includes('svelte')) {
    category = 'frontend'
  } else if (desc.includes('next') || desc.includes('nuxt') || desc.includes('fullstack')) {
    category = 'fullstack'
  } else if (
    desc.includes('express') ||
    desc.includes('fastify') ||
    desc.includes('koa') ||
    desc.includes('nest')
  ) {
    category = 'backend'
  } else if (desc.includes('library') || desc.includes('lib') || desc.includes('tsup')) {
    category = 'library'
  }

  return { category, techStack }
}

function genTemplates(): void {
  const dirs = readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()

  const templates: TemplateMeta[] = dirs.map((name) => {
    const pkgPath = join(TEMPLATES_DIR, name, 'package.json')
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    const description = pkg.description || ''
    const { category, techStack } = inferMeta(name, description)

    return {
      name,
      category,
      description,
      techStack,
      command: `npx @hacxy/kick new ${name} my-app`,
    }
  })

  writeFileSync(OUTPUT_FILE, JSON.stringify(templates, null, 2) + '\n', 'utf-8')
  console.log(`✓ Generated ${templates.length} templates to ${OUTPUT_FILE}`)
}

genTemplates()
