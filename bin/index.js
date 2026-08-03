#!/usr/bin/env node

// 启用 vim 模式，支持 j/k 上下移动
process.env.INQUIRER_KEYBINDINGS = 'vim'

import chalk from 'chalk'
import inquirer from 'inquirer'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { cp, mkdir, readdir, rm } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ora from 'ora'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const TEMPLATES_DIR = join(__dirname, '..', 'templates')

// 获取模板描述
function getTemplateDescription(templatePath) {
  const pkgPath = join(templatePath, 'package.json')
  if (!existsSync(pkgPath)) return ''

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    return pkg.description || ''
  } catch {
    return ''
  }
}

// 获取可用模板列表
function getTemplates() {
  if (!existsSync(TEMPLATES_DIR)) {
    return []
  }

  const dirs = readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  return dirs.map((name) => ({
    name,
    path: join(TEMPLATES_DIR, name),
    description: getTemplateDescription(join(TEMPLATES_DIR, name)),
  }))
}

// 解析项目路径
function resolveProjectPath(projectName) {
  if (projectName === '.' || projectName === './') {
    return process.cwd()
  }
  return join(process.cwd(), projectName)
}

// 获取显示用的项目名
function getVisibleProjectName(projectName) {
  if (projectName === '.' || projectName === './') {
    return process.cwd().split(/[\\/]/).pop() || 'project'
  }
  return projectName
}

// 检查目录是否为空
async function isDirEmpty(dir) {
  if (!existsSync(dir)) return true
  const files = await readdir(dir)
  return files.length === 0
}

// 清空目录
async function emptyDir(dir) {
  const files = await readdir(dir)
  await Promise.all(files.map((file) => rm(join(dir, file), { recursive: true, force: true })))
}

// 复制目录
async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true })
  const entries = await readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath)
    } else {
      await cp(srcPath, destPath)
    }
  }
}

// 获取 shared 包版本
function getSharedPackageVersion(packageName) {
  const pkgPath = join(__dirname, '..', 'shared', packageName, 'package.json')
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    return pkg.version
  } catch {
    return '0.0.0'
  }
}

// 替换 workspace:* 为实际版本
function replaceWorkspaceVersions(dir) {
  const pkgPath = join(dir, 'package.json')
  if (!existsSync(pkgPath)) return

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))

    const versions = {
      '@hacxy/tsconfig': getSharedPackageVersion('tsconfig'),
      '@hacxy/eslint-config': getSharedPackageVersion('eslint-config'),
      '@hacxy/prettier-config': getSharedPackageVersion('prettier-config'),
    }

    const replace = (deps) => {
      if (!deps) return
      for (const [name, version] of Object.entries(versions)) {
        if (deps[name] && deps[name].startsWith('workspace:')) {
          deps[name] = `^${version}`
        }
      }
    }

    replace(pkg.dependencies)
    replace(pkg.devDependencies)

    writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
  } catch {
    // ignore invalid package.json
  }
}

// 更新 package.json 中的 name
async function updatePackageName(dir, name) {
  const pkgPath = join(dir, 'package.json')
  if (!existsSync(pkgPath)) return

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    pkg.name = name
    writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
  } catch {
    // ignore invalid package.json
  }
}

// 选择模板
async function selectTemplate(templates) {
  // 计算最大名称长度用于对齐
  const maxNameLength = Math.max(...templates.map((t) => t.name.length))

  const { template } = await inquirer.prompt([
    {
      type: 'select',
      name: 'template',
      message: 'Select template:',
      choices: templates.map((t) => ({
        name: `${t.name.padEnd(maxNameLength)}  ${chalk.gray(t.description)}`,
        value: t,
      })),
    },
  ])
  return template
}

// 解析模板
async function resolveTemplate(templateName, templates) {
  if (templateName) {
    const found = templates.find((t) => t.name === templateName)
    if (!found) {
      console.error(chalk.red(`Template "${templateName}" not found`))
      console.log(chalk.gray('Available templates:'))
      templates.forEach((t) => console.log(chalk.gray(`  - ${t.name}`)))
      process.exit(1)
    }
    return found
  }
  return selectTemplate(templates)
}

// 解析项目名
async function resolveProjectName(argName) {
  if (argName) return argName

  const { projectName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Enter project name:',
      validate: (input) => {
        if (!input) return 'Project name cannot be empty'
        return true
      },
    },
  ])
  return projectName
}

// 确保目标目录为空
async function ensureDestEmpty(dest, projectName) {
  if (!existsSync(dest)) return

  if (!(await isDirEmpty(dest))) {
    const { shouldClear } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldClear',
        message: `${dest} already exists and is not empty, clear and continue?`,
        default: false,
      },
    ])

    if (!shouldClear) {
      console.log(chalk.yellow('Operation cancelled'))
      process.exit(0)
    }

    if (projectName === '.' || projectName === './') {
      await emptyDir(resolve(dest))
    } else {
      await rm(dest, { recursive: true, force: true })
    }
  }
}

// 创建项目
async function createProject(templateName, projectName) {
  const templates = getTemplates()

  if (templates.length === 0) {
    console.error(chalk.red('No templates found'))
    process.exit(1)
  }

  const template = await resolveTemplate(templateName, templates)
  const name = await resolveProjectName(projectName)
  const visibleName = getVisibleProjectName(name)
  const dest = resolveProjectPath(name)

  await ensureDestEmpty(dest, name)

  const spinner = ora(`Creating project ${chalk.cyan(visibleName)}...`).start()

  try {
    await copyDir(template.path, dest)
    await updatePackageName(dest, visibleName)
    replaceWorkspaceVersions(dest)
    spinner.succeed(`Project ${chalk.cyan(visibleName)} created successfully`)
  } catch (err) {
    spinner.fail(`Failed to create project: ${err.message}`)
    process.exit(1)
  }

  console.log()
  console.log(chalk.cyan(`  cd ${name}`))
  console.log(chalk.cyan('  pnpm install'))
  console.log(chalk.cyan('  pnpm dev'))
  console.log()
}

// 列出模板
function listTemplates() {
  const templates = getTemplates()

  if (templates.length === 0) {
    console.log(chalk.yellow('No templates found'))
    return
  }

  console.log()
  console.log(chalk.cyan(`Available templates (${templates.length}):\n`))

  // 计算最大名称长度用于对齐
  const maxNameLength = Math.max(...templates.map((t) => t.name.length))

  templates.forEach((t) => {
    const name = chalk.green(t.name.padEnd(maxNameLength))
    const desc = t.description ? chalk.gray(`  ${t.description}`) : ''
    console.log(`  ${name}${desc}`)
  })
  console.log()
}

// CLI 参数解析
function parseArgs() {
  const args = process.argv.slice(2)
  const command = args[0]

  if (command === 'list' || command === 'ls') {
    return { action: 'list' }
  }

  if (command === 'new' || command === 'create') {
    return {
      action: 'create',
      template: args[1],
      projectName: args[2],
    }
  }

  if (command === '--version' || command === '-v') {
    return { action: 'version' }
  }

  if (command === '--help' || command === '-h' || !command) {
    return { action: 'help' }
  }

  // 默认：kick <template> <projectName>
  return {
    action: 'create',
    template: args[0],
    projectName: args[1],
  }
}

// 显示帮助
function showHelp() {
  console.log()
  console.log(chalk.cyan('kick') + chalk.gray(' - Project scaffolding CLI'))
  console.log()
  console.log(chalk.yellow('Usage:'))
  console.log('  kick [template] [projectName]  Create a new project')
  console.log('  kick new [template] [name]     Create a new project')
  console.log('  kick list                      List available templates')
  console.log()
  console.log(chalk.yellow('Options:'))
  console.log('  -h, --help     Show help')
  console.log('  -v, --version  Show version')
  console.log()
}

// 主函数
async function main() {
  const { action, template, projectName } = parseArgs()

  switch (action) {
    case 'list':
      listTemplates()
      break
    case 'create':
      await createProject(template, projectName)
      break
    case 'version': {
      try {
        const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'))
        console.log(pkg.version)
      } catch {
        console.log('unknown')
      }
      break
    }
    case 'help':
      showHelp()
      break
  }
}

main().catch((err) => {
  console.error(chalk.red(err.message))
  process.exit(1)
})
