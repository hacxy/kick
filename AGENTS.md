# AGENTS.md

## 项目概述

Kick 是一个项目脚手架 CLI 工具，采用 monorepo 结构。

## 禁止事项

- 禁止使用注释来解决lint问题

## 项目结构

```
kick/
├── bin/
│   └── index.js              # CLI 入口
├── shared/
│   ├── tsconfig/             # @hacxy/tsconfig
│   ├── eslint-config/        # @hacxy/eslint-config
│   └── prettier-config/      # @hacxy/prettier-config
├── templates/
│   ├── react/                # React 19 + Vite + Tailwind CSS
│   ├── vue/                  # Vue 3 + Vite + UnoCSS
│   ├── next/                 # Next.js 15 + Tailwind CSS
│   ├── express/              # Express + TypeScript
│   └── library/              # TypeScript + tsup + Vitest
├── src/                      # Web UI
├── docs/                     # 文档
├── scripts/
│   └── release.sh            # 发布脚本
└── package.json              # @hacxy/kick
```

## 开发规范

### 添加新模板

1. 在 `templates/` 下创建目录
2. 模板的 `package.json` 中：
   - `name` 为 `@hacxy/tpl-{名称}`
   - `version` 固定为 `"0.0.0"`
   - `description` 简短描述模板内容
   - `devDependencies` 引用 `@hacxy/*` 配置包（使用 `workspace:*`）
3. 配置文件使用 `extends` 继承共享配置：
   - `eslint.config.js` → `import { hacxy } from '@hacxy/eslint-config'`
   - `tsconfig.json` → `"extends": "@hacxy/tsconfig/react.json"` 或其他预设
   - `.prettierrc` → `"@hacxy/prettier-config"`

### 模板命名规则

- 框架叫什么，模板名就叫什么（如 `react`、`vue`、`next`）
- 不加类型后缀（如 `-web`、`-api`）
- 简洁明了，易于输入

### CLI 功能

- `kick list` — 列出所有可用模板及描述
- `kick [template] [projectName]` — 创建项目
- `kick new [template] [projectName]` — 创建项目
- 支持 vim 风格 j/k 上下移动选择器

## 共享配置包

### @hacxy/tsconfig

TypeScript 配置预设，包含：

- `base.json` — 基础配置
- `node.json` — Node.js 项目
- `react.json` — React 项目
- `vue.json` — Vue 项目
- `lib.json` — 库开发

### @hacxy/eslint-config

ESLint 9 Flat Config，使用函数式配置：

```js
import { hacxy } from '@hacxy/eslint-config'

export default hacxy({
  react: true, // 启用 React 规则
  vue: false, // 启用 Vue 规则
  node: false, // 启用 Node.js 规则
  lib: false, // 启用库开发规则
})
```

### @hacxy/prettier-config

统一的代码格式化配置。

## 发布流程

### 使用脚本发布

```bash
# 发布 patch 版本
./scripts/release.sh patch

# 发布 minor 版本
./scripts/release.sh minor

# 发布 major 版本
./scripts/release.sh major
```

### 发布流程

1. 检查未提交的更改
2. 检查是否在 main 分支
3. 更新所有包的版本号
4. 提交并打 tag
5. 推送到 GitHub
6. GitHub Actions 自动发布到 npm
7. 使用 `changelogithub` 生成 GitHub Release

### 版本管理

- 各包独立管理版本
- 模板中的 `workspace:*` 由 CLI 在创建项目时动态替换为实际版本

## Web UI

基于 React + Vite + Tailwind CSS 构建，用于：

- 可视化查看共享配置包的规则
- 展示所有可用模板
- 展示模板详情

开发命令：

```bash
pnpm dev      # 启动开发服务器
pnpm build    # 构建
```

## 注意事项

- ESLint 使用 9.x 版本（eslint-plugin-unicorn 需要 ^65.0.0）
- 模板中的 `workspace:*` 不会在发布时修改，由 CLI 动态替换
- Web UI 使用字节的字体 CDN（`fonts.douyin.com`），国内可访问
