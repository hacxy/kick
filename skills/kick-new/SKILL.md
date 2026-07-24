---
name: kick-new
description: Create a new project using kick scaffolding CLI
---

# Kick New

Create a new project from kick templates.

## When to Use This Skill

Use this skill when the user wants to:

- Create a new project
- Scaffold a new application
- Start a new project from a template

## How to Create a Project

### 1. Check Available Templates First

Before creating a project, check if the requested template exists:

```bash
npx @hacxy/kick list
```

### 2. Create Project

```bash
npx @hacxy/kick new [template] [projectName]
```

### Options

- `-t, --template <template>` - Specify template name
- `--refresh` - Force refresh template cache

### Example

```bash
kick new react-web my-app
```

If no template specified, interactive mode will guide you through selection.
