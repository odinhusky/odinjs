# Repository 指引

## Repo 專用 Skills

- 任務專用流程放在 `skills/<skill-name>/SKILL.md`；只有在觸發條件符合使用者請求，或使用者明確要求時，才載入對應 skill。

## 專案結構與模組組織

- Quasar/Vue app 位於 `src/`。
- 共用基礎元件放在 `src/common`（components、composables、directives、utils），共用頁面視圖放在 `src/common/pages`。
- 驅動跨 tenant 邏輯的共用 hooks 與 composables 位於 `src/common/hooks` 與 `src/common/composables`；可重用
  composables 使用 `useXxx` 命名。
- Boot plugins（axios、i18n、dayjs）位於 `src/boot`。
- Router 入口位於 `src/router`，Pinia stores 位於 `src/stores`，API clients 位於 `src/api`，其 contracts 位於
  `src/api/request.type.ts` 與 `src/api/response.type.ts`。
- Static assets 放在 `public/`，Cordova shells 放在 `src-cordova`，自動化 scripts 放在 `tool/`，production
  bundles 放在 `dist/`。
- Tenant-specific layouts、pages、assets、routes、composables 與 hooks 都放在 `template/<siteKey>`。

## Template 選擇流程

- 這是 multi-tenant cash gaming platform。
- Local development 時 active skin 由 `src/env/environment.json` 決定，接著 `quasar.config.js` 將
  `@router/build` 對應到 `template/<siteKey>/router/routes.ts`；production packaging 則使用 build
  environment/site config。
- 將 `src/env/environment.json` 視為 local-development-only：除非使用者明確要求，否則不要 inspect、diff、format、
  test 或 review。
- Template packages 封裝各 brand 的 front-office pages、assets、routes 與 bespoke hooks。
- Template-specific work 應留在指定的 `template/<siteKey>` folder；只有在使用者要求 shared behavior、明確說
  all templates，或目前實作證明所有受影響 templates 都使用 shared path 時，才編輯 shared code。

## 範圍與探索

- 如果請求缺少 scope，編輯前先詢問精確的 template/siteKey、shared module、route/page、component/composable、
  hook 或 CSS surface。
- 新增 component、composable、exported helper、route 或 API wrapper 前，先說明可能受影響的 files，並檢查是否已有等效邏輯。
- 從 repo root 使用 scoped `rg` / `rg --files` searches；不要執行像 `find ..` 這類 broad parent-directory
  scans。
- 搜尋範圍應限制在已命名的 template、shared hook/composable、route file、API wrapper 或 component family。

## 建置、測試與開發指令

- 使用 `pnpm install`、`npm install` 或 `yarn` 安裝 dependencies（pnpm 是預設文件流程，且符合 `pnpm-lock.yaml`）。
- `pnpm run dev` / `npm run dev` / `yarn dev` 會啟動 web dev server；Cordova targets 使用相同 prefix
  pattern：`dev:android` / `dev:ios`。
- 使用 `pnpm run build`（或 `npm run build` / `yarn build`）產出 production assets；需要只產 web bundles 時，使用
  `... build:onlyCode` / `... build:allCode`。
- 新增 env keys 後執行 `node tool/build/createEnv`。
- Locale copy 由 runtime remote loading 提供；copy changes 不要新增 local locale JSON。

## 程式風格與命名慣例

- Prettier 與 ESLint 強制 2-space indentation、double quotes、no semicolons、依設定保留 trailing commas，以及
  `printWidth: 120`；保持 editor integrations 啟用。
- Vue single-file components 使用 PascalCase 命名（例如 `AgentBanner.vue`），composables 命名為 `useFeature.ts`，
  Pinia stores 以 `Store` 結尾。
- Imports 放在檔案頂端，完成前確認沒有 missing imports。
- 遵守 ESLint import sorting 與 unused-import checks。
- Shared Tailwind helpers 集中在 `src/common/css`，遵守 `.editorconfig`，新的 utilities 或 reusable hooks 優先使用
  TypeScript。
- 若 hook 屬於 template-specific，實作在 `template/<siteKey>/hooks`；只有 shared consumers 需要時，才在 shared
  code 暴露 thin adapter。

## API 與 Composable 慣例

- API calls 應透過 `src/api/<domain>.ts` wrappers 使用 `requestApi`，並搭配 central `Request` / `Response` types。
- API payload shapes 改變時，在 `src/api/request.type.ts` 與 `src/api/response.type.ts` 新增或調整 request/response
  interfaces。
- 新增 composables/hooks 前先重用既有實作，新的 composables 保持 single-purpose。

## 遠端 I18n

- 此專案透過 `src/boot/i18n.ts` 動態載入 vue-i18n messages；此 repository 不維護 local locale JSON files。
- 永遠不要搜尋、編輯或建立 local locale files，例如 `locales/*.json`。
- 除非使用者提供精確 replacement，否則保留既有 `$t(...)` 與 `t(...)` calls。
- 若使用者提供精確 remote i18n key，直接使用 `$t("...")` 或 `t("...")`。
- 若需要新的 user-visible copy 且未提供 remote key，請 hardcode copy 或詢問使用者；不要自行發明新的 i18n keys。

## 測試指引

- 目前尚未宣告 testing scripts；新增 specs 時放在 source 旁邊（例如 `src/common/components/Card.spec.ts`），並在 PR
  說明如何執行。
- Manual verification 需記錄受影響 tenant、breakpoint 與 platform。
- Cordova-sensitive changes 使用 package manager 的 `run dev:<platform>`（例如 `pnpm run dev:android`）驗證，並列出
  reviewers 需要的 data seeds 或 feature toggles。
- Routine changes 使用 touched files 的最小相關 validation，通常是 targeted Prettier/ESLint 加上
  `git --no-pager diff --check`。
- 不要執行 `tsc --noEmit`。

## Commit 與 Pull Request 指引

- `main` 上的 commits 保持簡短且 scope-first（參考近期 `fix/title_set_cover` 系列）；第一行 <=50 characters 並使用
  imperative。
- 使用 topic branches，例如 `feature/<scope>` 或 `fix/<issue>`，merge 前先 rebase。
- PR 應說明 scope、列出 manual test evidence、連結 tickets、附上 UI screenshots 或 clips，並標示必須重新執行的
  template scripts。
- Review uncommitted changes 時，使用 non-interactive git commands，例如 `git status --short`、`git --no-pager diff` 與
  `git --no-pager diff --cached`，除非使用者要求，否則排除 `src/env/environment.json`。

## 設定與 Secrets

- 當 local tooling 需要 repo-pinned runtime 時，使用 Node.js 22。
- Environment templates（`env.development`、`env.production` 等）位於 repo root；複製成 local `.env` files，並讓 secrets
  保持在 Git 之外。
- 新增 keys 時透過 `tool/build/createEnv`，並更新 `src/boot/env` 中的 helpers，讓 tenant overrides 維持 centralized。
- Agent branding 屬於 `template/` 與 `src/common/assets`；避免在 shared modules hardcode tenant IDs，只 commit sanitized
  environment examples。
