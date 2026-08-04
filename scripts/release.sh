#!/bin/bash

# Kick 发布脚本
# 用法: ./scripts/release.sh [patch|minor|major]
#
# 此脚本只负责：
# 1. 更新所有包的版本号
# 2. 提交并打 tag
# 3. 推送到 GitHub
#
# 发布到 npm 由 GitHub Actions 自动完成
# 模板中的 workspace:* 由 CLI 在创建项目时动态替换

set -e

VERSION_TYPE=${1:-minor}

echo "🚀 Starting release process..."
echo ""

# 1. 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Error: There are uncommitted changes. Please commit or stash them first."
  exit 1
fi

# 2. 检查是否在 main 分支
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "❌ Error: Must be on main branch. Current branch: $CURRENT_BRANCH"
  exit 1
fi

echo "📦 Version type: $VERSION_TYPE"
echo ""

# 3. 更新 shared 包版本
echo "📦 Updating shared packages versions..."
for pkg in tsconfig prettier-config eslint-config; do
  cd "shared/$pkg"
  npm version "$VERSION_TYPE" --no-git-tag-version
  NEW_VERSION=$(node -p "require('./package.json').version")
  echo "  ✅ @hacxy/$pkg → $NEW_VERSION"
  cd ../..
done

# 4. 更新 CLI 版本（独立版本管理）
echo ""
echo "📦 Updating CLI version..."
cd .
npm version "$VERSION_TYPE" --no-git-tag-version
CLI_VERSION=$(node -p "require('./package.json').version")
echo "  ✅ @hacxy/kick → $CLI_VERSION"
cd .

# 5. 提交版本更新
echo ""
echo "📝 Committing version updates..."
git add .
git commit -m "chore: release v$CLI_VERSION"

# 6. 创建 git tag
git tag "v$CLI_VERSION"

# 7. 推送到 GitHub
echo ""
echo "📤 Pushing to GitHub..."
git push
git push --tags

echo ""
echo "✅ Version v$CLI_VERSION tagged and pushed!"
echo ""
echo "GitHub Actions will now automatically publish:"
echo "  - @hacxy/tsconfig"
echo "  - @hacxy/prettier-config"
echo "  - @hacxy/eslint-config"
echo "  - @hacxy/kick@$CLI_VERSION"

echo ""
echo "👀 Watching GitHub Actions (requires gh CLI)..."
HEAD_SHA=$(git rev-parse HEAD)
RUN_ID=""
for _ in $(seq 1 15); do
RUN_ID=$(gh run list --workflow=Release --limit=5 --json databaseId,headSha \
--jq ".[] | select(.headSha == \"$HEAD_SHA\") | .databaseId" 2>/dev/null | head -1)
[ -n "$RUN_ID" ] && break
sleep 2
done

if [ -z "$RUN_ID" ]; then
echo "⚠️ 未能自动定位 CI 运行，可手动查看：gh run list --workflow=Release"
exit 0
fi

if gh run watch "$RUN_ID" --exit-status; then
URL=$(gh run view "$RUN_ID" --json url --jq .url)
echo ""
echo "✅ 发布成功：$URL"
echo "   验证：npm view @hacxy/kick version"
else
echo ""
echo "❌ CI 运行失败，查看详情：gh run view $RUN_ID --log-failed"
exit 1
fi
