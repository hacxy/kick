# AGENTS.md

## Overview

`@hacxy/kick` — 项目模板脚手架 CLI。从 GitHub 仓库拉取模板，快速创建项目。

## Key Commands

```sh
pnpm install            # install
pnpm build              # build with tsdown
pnpm lint               # eslint
pnpm lint:fix           # eslint --fix
pnpm cz                 # interactive commit (czg)
pnpm test               # run tests in watch mode
pnpm test:run           # run tests once
pnpm test:coverage      # run tests with coverage
npm run release         # release new version (builds, versions, publishes to npm)
```

## Project Structure

```
src/
  index.ts              # CLI entry (cac)
  commands/new.ts       # kick new command
  services/
    template.ts         # fetch remote template index (templates.json)
    download.ts         # download GitHub repo using degit
    cache.ts            # local cache (~/.fe/cache/)
  utils.ts              # common utilities
test/
  commands/new.test.ts  # tests for kick new command
  services/             # tests for services
  utils.test.ts         # tests for utilities
scripts/
  commit-msg.mjs        # git hook: commit message validation
templates.json          # template index (remote)
index.js                # shebang entry (#/usr/bin/env node → dist/index.js)
```

## Architecture

- Single package (not a monorepo). `pnpm build` builds `src/` to `dist/` via `tsdown`.
- Templates are remote GitHub repos (`hacxy/tpl-{name}`). CLI downloads zip, extracts, renames `package.json` name field.
- Template index is `templates.json` at repo root, fetched from GitHub raw URL at runtime.
- Local cache: `~/.fe/cache/{template-name}/`. `--refresh` flag forces re-download.
- Commit convention: Angular-style, validated by git hook (`scripts/commit-msg.mjs`).

## Conventions

- ESM-only (`"type": "module"`)
- Indent: 2 spaces, LF line endings
- ESLint: `@hacxy/eslint-config/nodejs`
- TypeScript: `@hacxy/tsconfig` base config
- Build tool: `tsdown` (ESM output, node18 target)

## Release Process

1. Update version in `package.json`
2. Commit changes
3. Create git tag
4. Push to GitHub
5. Publish to npm

Use `npm run release` to automate this process.
