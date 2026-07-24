# @hacxy/kick

A project scaffolding CLI tool. Pull templates from GitHub repositories and create projects quickly.

## Installation

```sh
npm i -g @hacxy/kick
```

Or use directly with npx:

```sh
npx @hacxy/kick@latest new
```

## Usage

```sh
# Interactive template selection
npx @hacxy/kick@latest new

# Specify template
npx @hacxy/kick@latest new react-web

# Specify template and project name
npx @hacxy/kick@latest new react-web my-app

# Force refresh cache
npx @hacxy/kick@latest new react-web --refresh

# List available templates
npx @hacxy/kick@latest list
```

## Templates

Template index is defined in `templates.json`, each template is a separate GitHub repository.

| Template     | Description                                   | Repository             |
| ------------ | --------------------------------------------- | ---------------------- |
| react-web    | React 19 + Vite + TypeScript web app          | hacxy/tpl-react-web    |
| elysiajs     | Lightweight ElysiaJS backend service template | hacxy/tpl-elysiajs     |
| react-elysia | Elysia + React 19 + Bun monorepo fullstack    | hacxy/tpl-react-elysia |
| nextjs       | Next.js fullstack web app template            | hacxy/tpl-nextjs       |

## Cache

Downloaded templates are cached to `~/.fe/cache/`. Subsequent creations of the same template use the cache. Use `--refresh` to force re-download.

## Skills

The project includes skills that can be installed to AI Agents:

```sh
kick setup
```

Supported Agent platforms:

- OpenCode
- Claude Code
- Hermes

## Development

```sh
pnpm install
pnpm dev          # watch mode
pnpm build        # build
pnpm lint         # lint
```

## License

MIT
