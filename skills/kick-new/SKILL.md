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

### Basic Usage

```bash
kick new [template] [projectName]
```

### Options

- `-t, --template <template>` - Specify template name
- `--refresh` - Force refresh template cache

### Interactive Mode

Run `kick new` without arguments to enter interactive mode:

```bash
kick new
```

The CLI will prompt you to:

1. Select a category (web, server, fullstack)
2. Select a template
3. Enter project name

### Direct Mode

Specify template and project name directly:

```bash
kick new react-web my-app
```

Or using options:

```bash
kick new -t react-web my-app
```

### Available Templates

Use `kick list` to see all available templates.

### Examples

Create a React web project:

```bash
kick new react-web my-react-app
```

Create with specific template option:

```bash
kick new -t elysia-server my-api
```

Force refresh cache and create:

```bash
kick new react-web my-app --refresh
```
