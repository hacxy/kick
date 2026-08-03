# Kick 模板规范

## 目录结构

```
templates/
├── react/           # @hacxy/tpl-react
├── vue/             # @hacxy/tpl-vue
├── next/            # @hacxy/tpl-next
├── express/         # @hacxy/tpl-express
└── library/         # @hacxy/tpl-library
```

## 模板清单

| 分类        | 模板名    | 技术栈                                      |
| ----------- | --------- | ------------------------------------------- |
| `frontend`  | `react`   | React 19 + Vite + TypeScript + Tailwind CSS |
| `frontend`  | `vue`     | Vue 3 + Vite + TypeScript + UnoCSS          |
| `fullstack` | `next`    | Next.js 15 + TypeScript + Tailwind CSS      |
| `backend`   | `express` | Express + TypeScript                        |
| `others`    | `library` | TypeScript + tsup + Vitest                  |

## 命名规则

- 框架叫什么，模板名就叫什么
- 不加类型后缀（如 `-web`、`-api`）
- 简洁明了，易于输入

## 使用方式

```bash
kick new react          # 创建 React 前端项目
kick new vue            # 创建 Vue 前端项目
kick new next           # 创建 Next.js 全栈项目
kick new express        # 创建 Express 后端项目
kick new library        # 创建 TypeScript 库
```

## 共享配置包

| 包名                     | 作用                |
| ------------------------ | ------------------- |
| `@hacxy/tsconfig`        | TypeScript 配置预设 |
| `@hacxy/eslint-config`   | ESLint 代码规范     |
| `@hacxy/prettier-config` | 代码格式化          |

---

## @hacxy/tsconfig 配置详情

### 文件清单

```
@hacxy/tsconfig/
├── configs/
│   ├── base.json        # 基础配置
│   ├── node.json        # Node.js 项目
│   ├── react.json       # React 项目
│   ├── vue.json         # Vue 项目
│   └── lib.json         # 库开发
└── package.json
```

### base.json

基础配置，所有项目通用。

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "noUncheckedIndexedAccess": true
  },
  "exclude": ["node_modules", "dist"]
}
```

### node.json

Node.js 项目（后端、CLI）。

```json
{
  "extends": "@hacxy/tsconfig/base.json",
  "compilerOptions": {
    "lib": ["ES2022"],
    "types": ["node"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}
```

### react.json

React 项目（使用 Vite）。

```json
{
  "extends": "@hacxy/tsconfig/base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "types": ["vite/client"]
  }
}
```

### vue.json

Vue 项目（使用 Vite）。

```json
{
  "extends": "@hacxy/tsconfig/base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve"
  }
}
```

**注意**：Vue 项目需要配合 `vue-tsc` 进行类型检查。

### lib.json

库/包开发。

```json
{
  "extends": "@hacxy/tsconfig/base.json",
  "compilerOptions": {
    "lib": ["ES2022"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "emitDeclarationOnly": true
  }
}
```

---

## @hacxy/eslint-config 配置详情

### 设计方案

- **配置方式**：单一入口函数式
- **ESLint 版本**：9.x
- **格式化工具**：Prettier（独立）
- **Prettier 兼容**：`eslint-config-prettier`

### 使用方式

```js
// eslint.config.js
import { hacxy } from '@hacxy/eslint-config'

export default hacxy({
  react: true, // 启用 React 规则
  vue: false, // 启用 Vue 规则
})
```

### 依赖版本

| 包                             | 版本   | 作用                |
| ------------------------------ | ------ | ------------------- |
| `eslint`                       | 9.x    | Lint 工具           |
| `typescript-eslint`            | 最新版 | TypeScript 规则     |
| `@stylistic/eslint-plugin`     | 最新版 | 代码风格            |
| `eslint-plugin-perfectionist`  | 最新版 | 排序规则            |
| `eslint-plugin-unicorn`        | 最新版 | 最佳实践            |
| `eslint-plugin-unused-imports` | 最新版 | 未使用 import       |
| `eslint-config-prettier`       | 最新版 | Prettier 兼容       |
| `eslint-plugin-vue`            | 最新版 | Vue 规则（按需）    |
| `eslint-plugin-react`          | 最新版 | React 规则（按需）  |
| `eslint-plugin-react-hooks`    | 最新版 | React Hooks（按需） |

### 基础规则集（必选）

| 包                             | 作用            |
| ------------------------------ | --------------- |
| `@eslint/js`                   | ESLint 推荐规则 |
| `typescript-eslint`            | TypeScript 规则 |
| `@stylistic/eslint-plugin`     | 代码风格        |
| `eslint-plugin-perfectionist`  | 排序规则        |
| `eslint-plugin-unicorn`        | 最佳实践        |
| `eslint-plugin-unused-imports` | 未使用 import   |
| `eslint-config-prettier`       | Prettier 兼容   |

### 框架规则集（按需启用）

| 包                          | 作用        |
| --------------------------- | ----------- |
| `eslint-plugin-vue`         | Vue 规则    |
| `eslint-plugin-react`       | React 规则  |
| `eslint-plugin-react-hooks` | React Hooks |

---

## @hacxy/prettier-config 配置详情

### 配置内容

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "arrowParens": "always",
  "bracketSpacing": true,
  "endOfLine": "lf"
}
```

### 使用方式

在项目根目录创建 `.prettierrc`：

```json
"@hacxy/prettier-config"
```

或者在 `package.json` 中：

```json
{
  "prettier": "@hacxy/prettier-config"
}
```

---

## 模板内置工具

| 工具          | 作用                     |
| ------------- | ------------------------ |
| `husky`       | Git hooks 管理           |
| `lint-staged` | 提交时自动 lint 暂存文件 |

### 模板 package.json scripts

```json
{
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write ."
}
```

### 模板 husky 配置

**依赖**:

```json
{
  "devDependencies": {
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0"
  },
  "scripts": {
    "prepare": "husky"
  }
}
```

**.husky/pre-commit**:

```sh
npx lint-staged
```

### 模板 lint-staged 配置

```json
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```
