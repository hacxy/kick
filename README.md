# @hacxy/kick

项目模板脚手架 CLI 工具。从 GitHub 仓库拉取模板，快速创建项目。

## 安装

```sh
npm i -g @hacxy/kick
```

或直接使用 npx：

```sh
npx @hacxy/kick new
```

## 使用

```sh
# 交互式选择模板
kick new

# 指定模板
kick new react-web

# 指定模板和项目名
kick new react-web my-app

# 强制刷新缓存
kick new react-web --refresh
```

## 模板

模板索引定义在 `templates.json` 中，每个模板是一个独立的 GitHub 仓库。

| 模板      | 说明                                  | 仓库                |
| --------- | ------------------------------------- | ------------------- |
| react-web | React 19 + Vite + TypeScript web 应用 | hacxy/tpl-react-web |

## 缓存

下载的模板会缓存到 `~/.fe/cache/`，后续创建同名模板时直接使用缓存。使用 `--refresh` 强制重新下载。

## 开发

```sh
pnpm install
pnpm dev          # watch 模式
pnpm build        # 构建
pnpm lint         # 检查
```

## License

MIT
