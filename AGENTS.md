# AGENTS.md

## 项目概述

这是一个项目脚手架 CLI 工具，采用 monorepo 结构。

**核心设计理念**：

- 模板是一次性脚手架，创建后与 CLI 无关
- 基础设施（ESLint、Prettier、TypeScript 配置）通过 `@hacxy/*` npm 包持续更新
- 用户通过 `pnpm update @hacxy/*` 更新配置，而不是同步模板

## 开发规范

### 添加新模板

1. 在 `packages/cli/templates/` 下创建目录
2. 模板的 `package.json` 中：
   - `version` 固定为 `"0.0.0"`
   - `devDependencies` 引用 `@hacxy/*` 配置包
3. 配置文件使用 `extends` 继承共享配置：
   - `eslint.config.js` → `export { default } from '@hacxy/eslint-config'`
   - `tsconfig.json` → `"extends": "@hacxy/tsconfig/react.json"` 或 `node.json`

## 项目结构

### CLI 包结构

`@hacxy/kick` npm 包包含：

- `dist/` - CLI 代码
- `templates/` - 所有模板文件
- `index.js` - bin 入口

用户使用 `npx @hacxy/kick new` 时，模板从包内复制，不需要联网下载。
