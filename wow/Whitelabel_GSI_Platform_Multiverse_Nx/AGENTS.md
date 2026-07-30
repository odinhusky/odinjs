# Repository 指引

## Repo 專用 Skills

- 任務專用流程放在 `skills/<skill-name>/SKILL.md`；只有在觸發條件符合使用者請求，或使用者明確要求時，才載入對應 skill。

## 專案結構

- 這是 Nx monorepo，主要前台 app 放在 `apps/<tenant>`，共用 Nuxt layer 放在 `libs/shared/ui-layer`。
- 目前完整 Nx/Nuxt 結構以 `origin/test/init-project-sturcture-1769408493481-localdummy` 為主要參考；若目前 checkout 只有 README，先用該 branch 做結構比對。
- Tenant app 使用 Nuxt 3 SPA，典型入口包含 `apps/<tenant>/project.json`、`apps/<tenant>/nuxt.config.ts`、`apps/<tenant>/src/app.vue`、`src/pages`、`src/components`、`src/composables`、`src/constants`、`src/stores`、`src/plugins`、`src/middleware` 與 `src/assets`。
- 共用 UI layer 提供 Nuxt module 設定、local i18n files、Base components、shared composables、Pinia stores、constants、API wrappers、TanStack Query hooks、PrimeVue preset 與 shared SCSS。
- Capacitor Android shell 位於 `android/`，root `capacitor.config.ts` 管理 native shell 設定。

## 探索與範圍

- 開始 repo 工作時，先用 `git status --short`、targeted `rg` / `rg --files`，以及目標 tenant 或 shared layer 的 sibling files。
- 不要把 `.nx/`、`dist/`、`node_modules/` 當 source truth；需要結構參考時優先讀 Git-tracked files 或指定 feature branch。
- 如果請求缺少 scope，編輯前先確認目標是 `apps/<tenant>`、`libs/shared/ui-layer`、Capacitor shell、generated artifact hygiene，或跨 tenant shared behavior。
- 新增 app、page、API wrapper、Base component、theme token 或 shared export 前，先檢查相同 domain 的既有 pattern。

## Nx / Nuxt / Tooling

- Nx targets 由 `project.json` 與 `nx.json` 管理；使用 `nx <target> <project>` 或 `nx run-many -t <target>`。
- App-local `nuxt.config.ts` 可透過 `extends` 繼承 `libs/shared/ui-layer`，並設定 app-local `srcDir`、`buildDir`、Tailwind、PrimeVue theme、fonts、imports、components 與 Pinia store paths。
- Dependency changes 必須進入 package manager lockfile；不要用 global install 解決 repo dependency。
- 本 repo 不執行 `tsc --noEmit`。

## 驗證

- Docs-only edits 使用 `git --no-pager diff --check -- AGENTS.md SKILL.md skills`。
- Code edits 依 touched surface 執行 focused validation，例如對目標 Nx project 跑 lint、build、preview 或 browser smoke test。
- Review dirty tree 時同時檢查 staged、unstaged、untracked files，但不要 revert unrelated changes。
