这个项目采用 pnpm Workspaces 方案

大致项目结构
my-monorepo/
├── package.json
├── pnpm-workspace.yaml
├── packages/
│ ├── ui/ # 组件库
│ ├── utils/ # 工具函数
│ └── cli/ # 命令行工具
└── docs/
├── web/ # 前台应用
└── admin/ # 后台管理

```pnpm-workspace.yaml
packages:
 - 'packages/*'
 - 'docs/*'
```

Q1: 为什么要用 Monorepo？
方便代码共享、统一依赖和构建、简化协作。适合多包项目

Q2: 和 Multi-Repo 比有什么区别？
Monorepo 是单一仓库存放多个包，统一管理依赖与构建；
Multi-Repo 是每个包单独一个仓库，独立版本控制。
Monorepo 更适合大型协作、统一管理，Multi-Repo 更适合独立发布和权限隔离。

Q3 问题背景：
多个包存在依赖关系，改动一个包，往往会影响多个下游包，全局构建
pnpm run build -r 会重复执行大量任务，极大增加构建时间

Q3: 如何优化 Monorepo 的构建性能？
核心目标是“只构建必要的包，并让相同任务复用上次结果。”

1.增量构建(使用 Turbrepo)
分析依赖导入导出关系图
packages/
├── utils/
├── ui/ (依赖 utils)
└── web/ (依赖 ui)
如果只修改了 packages/utils/index.ts,则只需重新构建：
utils → ui → web
实现方式：turbo run build

2.构建缓存
原理：
构建结果（例如产物、依赖、hash）会被缓存。
如果输入未改变，则跳过构建，直接复用缓存结果
实现

```turbo.json
{
  "pipeline": {
    "build": {
      "outputs": ["dist/**"],
      "cache": true
    }
  }
}
```

Q4 怎么做版本发布？
使用 Changesets 自动发布版本

1.安装依赖
pnpm add -D @changesets/cli
pnpm changeset init
在项目根目录会生成 .changeset/ 文件夹。
在修改包后

2.执行命令
pnpm changeset
🦋 Which packages would you like to include in this changeset?
→ @my-scope/utils, @my-scope/core
🦋 What kind of change is this for each package?
❯ patch(修复小问题) 1.0.0 → 1.0.1
minor(增加可选参数、新组件) 1.0.0 → 1.1.0
major(修改 API、删除旧接口) 1.0.0 → 2.0.0

系统会自动创建一个 .changeset/xxxx.md 文件：

```.changeset/xxxx.md
---
"@my/utils": patch
"@my/ui": minor
---

fix: 修复 utils 内部 bug
```

3.生成版本号与 changelog

pnpm changeset version
Changesets 会自动：
更新 package.json 中的版本号
生成 CHANGELOG.md
同步内部依赖版本

4.发布到 npm
pnpm changeset publish
