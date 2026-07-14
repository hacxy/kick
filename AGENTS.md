# AGENTS.md

## 模板系统

- 模板仓库命名规则：`hacxy/tpl-{name}`（如 `hacxy/tpl-react-web`）
- 模板索引文件：`templates.json` 存放在本仓库根目录
- 索引获取地址：`https://raw.githubusercontent.com/hacxy/kick/main/templates.json`
- 新增模板：只需在 `templates.json` 中添加条目并创建对应的 `hacxy/tpl-{name}` 仓库

## Commit 规范

Angular-style commit message，格式：`type(scope): subject`

有效 type：`feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|types`

详见 `.github/COMMIT_CONVENTION.md`

## 代理配置

CLI 会自动检测系统代理，支持以下环境变量：

- `https_proxy` / `HTTPS_PROXY`
- `http_proxy` / `HTTP_PROXY`

在国内环境需要设置代理才能访问 GitHub：

```sh
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
```
