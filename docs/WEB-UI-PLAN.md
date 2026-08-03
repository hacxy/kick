# Kick Web UI 计划

## 概述

为 Kick 项目创建一个 Web UI，用于：

1. 可视化查看共享配置包的规则及解释
2. 展示所有可用模板
3. 实时预览前端项目的运行效果

---

## 功能设计

### 1. 配置查看

展示三个共享配置包的规则：

| 配置包                   | 展示内容                        |
| ------------------------ | ------------------------------- |
| `@hacxy/tsconfig`        | 各预设的 compilerOptions 及说明 |
| `@hacxy/eslint-config`   | 各规则及说明                    |
| `@hacxy/prettier-config` | 格式化选项及说明                |

**交互方式**：

- 左侧选择配置包/预设
- 右侧展示规则列表
- 每条规则可展开查看详情

### 2. 模板展示

展示所有可用模板：

| 分类        | 模板       |
| ----------- | ---------- |
| `frontend`  | react, vue |
| `fullstack` | next       |
| `backend`   | express    |
| `others`    | library    |

**展示内容**：

- 模板名称和描述
- 技术栈标签
- 文件结构预览
- 使用方式

### 3. 项目预览

实时预览前端项目的运行效果：

| 项目类型    | 预览方式                                |
| ----------- | --------------------------------------- |
| **react**   | ✅ 实时预览（StackBlitz WebContainers） |
| **vue**     | ✅ 实时预览（StackBlitz WebContainers） |
| **next**    | ✅ 实时预览（StackBlitz WebContainers） |
| **express** | 📄 展示 API 文档 + 示例代码             |
| **library** | 📄 展示使用示例 + 代码高亮              |

**预览方式**：

- 使用 StackBlitz SDK
- 浏览器内运行模板项目
- 展示运行效果（右侧预览区）

---

## 技术方案

### 前端框架

| 选项     | 选择                             |
| -------- | -------------------------------- |
| 框架     | **React**                        |
| 构建工具 | **Vite**                         |
| UI 库    | **shadcn/ui** + **Tailwind CSS** |
| 代码高亮 | **Shiki**                        |
| 项目预览 | **@stackblitz/sdk**              |

### 项目位置

```
kick/
├── packages/
│   ├── cli/
│   ├── shared/
│   └── web/          # Web UI 项目
│       ├── src/
│       ├── public/
│       └── package.json
├── docs/
└── package.json
```

### 依赖

| 包                | 作用     |
| ----------------- | -------- |
| `react`           | 前端框架 |
| `vite`            | 构建工具 |
| `tailwindcss`     | CSS 框架 |
| `@stackblitz/sdk` | 项目预览 |
| `shiki`           | 代码高亮 |
| `lucide-react`    | 图标     |

---

## 页面结构

### 首页

```
┌─────────────────────────────────────────────────────────────┐
│  Kick - 项目脚手架 CLI                                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🚀 快速开始                                                 │
│  npx @hacxy/kick new react                                   │
│                                                              │
│  📦 可用模板                                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │ react  │ │  vue   │ │  next  │ │ express│ │library │   │
│  │ 前端   │ │ 前端   │ │ 全栈   │ │ 后端   │ │ 库     │   │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │
│                                                              │
│  ⚙️ 配置包                                                   │
│  - @hacxy/tsconfig                                          │
│  - @hacxy/eslint-config                                     │
│  - @hacxy/prettier-config                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 配置查看页

```
┌─────────────────────────────────────────────────────────────┐
│  配置查看                                                    │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  @hacxy/     │  base.json                                   │
│  tsconfig    │  ┌────────────────────────────────────────┐  │
│  ├─ base     │  │ compilerOptions                        │  │
│  ├─ node     │  │ ├─ target: "ES2022"                    │  │
│  ├─ react    │  │ │  └─ 编译目标版本                       │  │
│  ├─ vue      │  │ ├─ module: "ESNext"                    │  │
│  └─ lib      │  │ │  └─ 模块系统                          │  │
│              │  │ └─ ...                                 │  │
│  @hacxy/     │  └────────────────────────────────────────┘  │
│  eslint-     │                                              │
│  config      │                                              │
│  └─ ...      │                                              │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

### 模板预览页

```
┌─────────────────────────────────────────────────────────────┐
│  React 模板预览                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  技术栈: React 19 + Vite + TypeScript + Tailwind CSS        │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                                                         ││
│  │              StackBlitz 预览区                           ││
│  │              (iframe 嵌入)                               ││
│  │                                                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  📝 使用方式                                                  │
│  npx @hacxy/kick new react my-app                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 开发计划

### Phase 1 - 基础框架

- [ ] 初始化 Vite + React + TypeScript 项目
- [ ] 配置 Tailwind CSS + shadcn/ui
- [ ] 创建基础布局（Header、Sidebar、Content）
- [ ] 配置路由

### Phase 2 - 配置查看

- [ ] 创建配置数据结构
- [ ] 实现配置查看页面
- [ ] 添加规则解释
- [ ] 代码高亮

### Phase 3 - 模板展示

- [ ] 创建模板数据结构
- [ ] 实现模板列表页面
- [ ] 展示模板详情（技术栈、文件结构）

### Phase 4 - 项目预览

- [ ] 集成 @stackblitz/sdk
- [ ] 实现 react 模板预览
- [ ] 实现 vue 模板预览
- [ ] 实现 next 模板预览

### Phase 5 - 部署

- [ ] 配置构建脚本
- [ ] 部署到 GitHub Pages / Vercel

---

## 目录结构

```
packages/web/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   ├── config/
│   │   │   ├── ConfigViewer.tsx
│   │   │   └── RuleDetail.tsx
│   │   ├── template/
│   │   │   ├── TemplateList.tsx
│   │   │   └── TemplateCard.tsx
│   │   └── preview/
│   │       └── Preview.tsx
│   ├── data/
│   │   ├── tsconfig.ts
│   │   ├── eslint.ts
│   │   ├── prettier.ts
│   │   └── templates.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Config.tsx
│   │   └── Template.tsx
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```
