---
name: kick-list
description: List all available kick templates
---

# Kick List

List all available templates for project scaffolding.

## When to Use This Skill

Use this skill when the user wants to:

- See available project templates
- Check what templates can be used
- Browse template options

## How to List Templates

### Command

```bash
npx @hacxy/kick list
```

### Output

The command displays templates grouped by category:

```
可用 templates (4):

web:
  react-web              React 19 + Vite + TypeScript web 应用

server:
  elysiajs               轻量级 ElysiaJS 后端服务模板

fullstack:
  react-elysia           Elysia + React 19 + Bun monorepo 全栈模板
  nextjs                 Next.js 全栈 web 应用模板
```

### Example

```bash
npx @hacxy/kick list
```
