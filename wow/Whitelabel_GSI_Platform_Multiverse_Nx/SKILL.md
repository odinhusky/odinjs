# Multiverse Nx Frontend Skill

本文件是 `whitelabel-gsi-platform-multiverse-nx` 的 repo-local skill 入口。

Agent 執行任務時，先依照 root `AGENTS.md` 判斷任務範圍，再只載入符合觸發條件的子 skill。

## 子 skill

- `skills/multiverse-nx-app-structure/SKILL.md`：新增、檢查或調整 tenant app、Nx project config、Nuxt config、app-local assets、theme、plugins 或 middleware。
- `skills/multiverse-nx-feature-screen-flow/SKILL.md`：根據功能需求、斷點設計稿、互動狀態與 API/mock 資訊建構版型 app 功能畫面；會先檢查 shared page/component/composable/store/API hook，並依 shared-first 原則決定復用或新增。
- `skills/multiverse-nx-shared-feature-extraction/SKILL.md`：把既有 `apps/<tenant>` feature、page、component 或 layout-level widget 轉成 shared 共用，並保留 tenant assets、theme、`classObj`、mock、storage key 或 route wrapper 等版型客製邏輯。
- `skills/multiverse-nx-shared-api/SKILL.md`：新增 brand-new shared API wrapper、endpoint path、common type、TanStack Query key 或 query/mutation hook。
- `skills/multiverse-nx-tenant-page-flow/SKILL.md`：新增或調整 tenant Nuxt page、member route、layout、middleware auth route group 或 page-level composable flow。
- `skills/multiverse-nx-member-center-flow/SKILL.md`：處理會員中心 summary、history、bank card、orders、inbox、vip、aside/mobile content、filters、tables 或 pagination。
- `skills/multiverse-nx-auth-flow/SKILL.md`：處理 login、register、SMS login、forgot password、TOTP、OAuth、token store 或 auth middleware。
- `skills/multiverse-nx-i18n/SKILL.md`：檢查或修正 UI 文案、placeholder、狀態文案、`alt`、`aria-label`、遠端 locale key 對齊、硬碼文案與本地 locale hygiene。
- `skills/multiverse-nx-design-system/SKILL.md`：處理 Base components、PrimeVue preset、Tailwind preset、SCSS variables、fonts、theme tokens 或 shared UI layer components。
- `skills/multiverse-nx-local-dev/SKILL.md`：啟動或確認 tenant 本地開發服務、Nuxt prepare、Nx serve、localhost URL 或 dev server 狀態。
- `skills/multiverse-nx-generated-hygiene/SKILL.md`：review dirty tree、branch state、generated files、`.nx`、`dist`、`node_modules` 或 lockfile churn。

若任務同時符合多個子 skill，先載入主要修改範圍的 skill；只有真的需要跨範圍時，才再載入第二個 skill。
