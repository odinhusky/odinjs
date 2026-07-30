# AGENTS.md

## Repo-Local Skills

- 任務專用工作流程放在 `skills/<skill-name>/SKILL.md`；只有當其觸發條件符合使用者要求，或使用者明確要求時才載入。

## 專案結構

- 這是 Quasar 2 / Vite / Vue 3 dashboard app。使用 `.nvmrc` 指定的 Node 22。
- App 啟動流程放在 `src/boot`，包含 axios、env 載入、i18n、vue-query、directives 與 event bus 設定。
- Routes 與 route-level permissions 定義在 `src/router/routes.ts`。
- Feature screens 放在 `src/pages`；shared UI 放在 `src/components`。
- State 使用 Pinia stores，放在 `src/stores`。
- 較舊的共用邏輯通常在 `src/hook`；較新的共用邏輯通常在 `src/composables`。
- Constants 是 `src/utils/constants` 底下的 namespace-style modules，並從 `src/utils/constants/index.ts` re-export。

## 儲存庫探索與範圍

- 開始 repo 工作時，先用 `git status --short`、targeted `rg`，以及鄰近 sibling files；避免 broad scans。
- 除非使用者明確要求檢查 repo 外部，否則探索範圍只限本 repository。
- 新增檔案或 exports 前，先檢查可比較的 modules，以符合既有命名、放置位置與 route shape。
- 如果使用者要求未指定 feature scope，編輯前先詢問精確目標。
- 嚴格判斷變更應屬於 page、shared component、composable、hook、API wrapper、constants export，或 global CSS。
- 如果要新增 shared component 或 exported function，實作前先告知使用者可能受影響的 files 與 surfaces。

## API 與資料契約

- 在 `src/api/*` 新增或更新 endpoint wrappers；shared request 與 response contracts 保持在 `src/api/request.type.ts` 與 `src/api/response.type.ts`。
- `src/utils/request.ts` 的 standard helpers 回傳 `BaseResponse<T>`，其中 `T` 是 callers 使用的 unwrapped `data` payload。除非該 call path 真的回傳 raw backend envelope，否則不要把 wrapper generics 型別寫成 raw backend envelope。
- Platform endpoints 優先使用既有 `{ usePlatform: true }` request option 與 relative endpoint path pattern，讓 `src/utils/request.ts` 負責 `/platform/v1/...` rewrite。
- 新增 enum-like contracts 時，在 `src/utils/constants` 底下建立或更新聚焦的檔案，並從 `src/utils/constants/index.ts` export its namespace。
- 處理 central API type files 的 merge conflicts 時，除非使用者明確要求移除其中一方，否則保留雙方 additive exported contracts。
- 建立新邏輯前，先檢查既有 `src/api`、`src/hook`、`src/composables` 與 shared components。
- TypeScript 或 Vue edits 後，明確檢查 touched files 是否缺少 imports 或 exports。

## 權限

- Route access 來自 `src/router/routes.ts` 的 `meta.permission` 與 `src/hook/usePermission.ts` 的 `usePermission()`。
- 當 route-level permission 沒有暴露所需 nested bit 時，embedded feature controls 可能需要自己的 feature-local permission helper。
- 不要把 feature-level visibility 或 editability requests 轉成 route access changes。除非使用者明確要求，否則保持 page entry behavior 不變。

## 遠端 I18n

- 本專案透過 `src/boot/i18n.ts` 使用 dynamic remote vue-i18n loading；此 repository 不維護 locale JSON files。
- 絕不要搜尋、編輯或建立 local locale files，例如 `locales/*.json`。
- 除非使用者提供精確替換內容，否則完整保留既有 `$t(...)` 與 `t(...)` calls。
- 如果使用者提供精確的 remote i18n key，直接在 template 或 code 中使用 `$t("...")` / `t("...")`。
- 如果需要新的 user-visible copy 但沒有提供 key，請 hardcode 該 copy 或詢問使用者。不要自行發明新的 i18n keys。

## 驗證

- 優先對 touched files 做 focused validation：`git --no-pager diff --check -- <files>`、必要時執行 focused Prettier checks 與 focused ESLint commands。
- 此 repo 不要執行 `tsc --noEmit`。
- 像此檔案這類 documentation-only edits，`git --no-pager diff --check -- AGENTS.md` 即可。
