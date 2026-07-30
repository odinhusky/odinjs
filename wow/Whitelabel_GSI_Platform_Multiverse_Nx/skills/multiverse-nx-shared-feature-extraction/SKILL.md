---
name: multiverse-nx-shared-feature-extraction
description: 在 whitelabel-gsi-platform-multiverse-nx 中，當使用者要求把 apps/<tenant> 既有 feature、page、component、composable 或 layout-level widget 轉成 shared 共用，並保留 tenant assets、theme、classObj、mock、storage key 或 route wrapper 等版型客製邏輯時使用。
---

# Multiverse Nx Shared Feature Extraction

此 skill 用於把既有 tenant feature 抽到 `libs/shared/ui-layer`，同時保留 `apps/<tenant>` 的版型客製邊界。典型指令例如：「幫我把 referralRebate 轉成共用並保留個版型客制邏輯」。

## 使用時機

- RD 指定既有 tenant feature，要抽成 shared component / composable / API / constants。
- 需要判斷哪些檔案可共用，哪些必須留在 `apps/<tenant>`。
- 需要把 tenant page 改成 thin wrapper，引用 shared feature component 並傳 `classObj` / props。
- 需要整理 shared feature component 到 `libs/shared/ui-layer/src/lib/components/<domain>/`。
- 需要移除沒有 tenant 資源、沒有 tenant config 的 passthrough wrapper。

## 不使用時機

- 從零建立新功能畫面，改用 `skills/multiverse-nx-feature-screen-flow/SKILL.md`。
- 單純新增或調整 tenant route / middleware / layout，改用 `skills/multiverse-nx-tenant-page-flow/SKILL.md`。
- 單純新增 shared API wrapper 或 query hook，改用 `skills/multiverse-nx-shared-api/SKILL.md`。
- 單純修改 Base component、theme token 或 PrimeVue preset，改用 `skills/multiverse-nx-design-system/SKILL.md`。
- 尚未確認需求範圍、目標 tenant、目標 feature 或驗收方式時，先回報缺口，不直接搬檔。

## 必要資訊

- 目標 tenant，例如 `apps/r017`。
- 目標 feature / route / component，例如 `referralRebate`、`announcement`、`claimGift`。
- RD 預期保留的 tenant 客製內容，例如背景圖、mock adapter、storage key、page-size、route path、layout 或 `classObj`。
- 是否允許搬移、刪除或重新命名檔案。
- 驗證方式：至少 targeted `rg` / `git diff --check`，若需 Nuxt prepare、build、lint 或 browser smoke test，先等 RD 確認。

## 先讀的檔案

- `apps/<tenant>/src/pages/**`：目標 route wrapper、nested route、file-based route 是否可攤平。
- `apps/<tenant>/src/components/**`：tenant local wrapper、feature component、passthrough component。
- `apps/<tenant>/src/composables/**`、`src/constants/**`、`src/stores/**`：mock、storage key、tenant-specific state。
- `apps/<tenant>/src/public/**`：圖片、背景、icon、tenant public asset。
- `libs/shared/ui-layer/src/lib/components/**`：既有 Base component 與 feature domain folder。
- `libs/shared/ui-layer/src/lib/composables/**`、`src/lib/api/**`、`src/lib/constants/**`：既有 shared flow、API hook、route constants。
- root `SKILL.md` 與相關子 skill，確認是否要搭配 API、i18n、design-system 或 tenant-page skill。

## 分類規則

先把每個檔案或邏輯分類，不要直接搬：

- 放 shared：
  - 跨 tenant 可復用的 feature page component、panel、dialog、floating entry、domain component。
  - 可復用的 composable flow、API hook、constants、type、format helper。
  - 不依賴 tenant public asset、tenant mock、tenant route wrapper 或 tenant-only storage key 的 UI 結構。
- 留 tenant：
  - 直接引用 `apps/<tenant>/src/public` 的資源，例如 `/images/bg-img-pc.png`、`/images/claim-gift/floating-gift.png`。
  - tenant page-level 背景、漸層、寬度、layout override、theme override、`classObj`。
  - tenant mock adapter、local storage key、siteKey、tenant local composable。
  - 特殊 route path、layout、middleware 或 auth behavior。
- 可刪除 tenant wrapper：
  - 只做 `v-bind="$attrs"` 或單純 passthrough。
  - 沒有 tenant asset、tenant config、mock、storage key、route/layout 邏輯。
  - 沒有其他 tenant-local caller 依賴。

## 工作流程

1. 掃描目標 feature 的 tenant 與 shared 現況，列出所有 page、component、composable、constant、asset、caller。
2. 判斷任務分級；若會跨多 domain、大量檔案、API contract、auth、資料或路由規則，先回報並等待 RD 確認。
3. 依分類規則列出「搬到 shared」、「留在 tenant」、「刪除 passthrough」、「暫不動」。
4. Shared component 放到 domain folder：

```txt
libs/shared/ui-layer/src/lib/components/<domain>/
  <DomainPage>.vue
  <DomainPanel>.vue
  <DomainDialog>.vue
```

5. `Base*` component 維持在 `libs/shared/ui-layer/src/lib/components/` 根目錄，不搬。
6. `*Page.vue` 命名為 feature page component，不代表 Nuxt route page；Nuxt route wrapper 仍依 tenant/shared route ownership 決策放置。
7. Tenant route wrapper 若承接 tenant resource 或 config，保留並傳 props / `classObj` 給 shared component。
8. 若 tenant wrapper 沒有客製內容，才考慮移除或改用 shared auto-import；不要同時保留兩份同一路徑 route。
9. Storage key 若抽到 shared，優先使用 player-scoped key；避免固定 tenant-wide key 影響同 browser 多帳號。
10. 更新 imports：
    - tenant wrapper 改成 `@shared-src/lib/components/<domain>/<Component>.vue`。
    - shared component 內部相對 import 隨 folder 深度調整。
    - 測試檔相對路徑一併調整。
11. 檢查 Nuxt auto-import duplicate warning；helper 若已在 helper file export，不要再從 flow file re-export 同名項目。
12. 更新 root `SKILL.md`、task spec 或文件，記錄 shared / tenant 邊界。

## 常見錯誤

- 把引用 tenant `/images/...` 的 class 寫進 shared component default。
- 把所有 thin wrapper 都刪掉，忽略 wrapper 承接 tenant 背景、mock、storage key 或 page-size。
- 把純 passthrough wrapper 留在 tenant，造成同名 component 邊界混亂。
- 搬到 domain folder 後忘記更新 shared 內部相對 import。
- 搬 Nuxt page 時同時留下 `pages/foo.vue` 和 `pages/foo/index.vue`。
- Shared composable re-export helper，導致 Nuxt duplicated imports warning。
- 改動 Base component 或 shared token，卻沒有確認 blast radius。

## 驗證

最小驗證：

- `rg --files` 確認檔案只存在於預期位置。
- `rg` 確認舊 import path 無殘留。
- `rg` 確認 shared component 不直接引用 tenant public asset，例如 `/images/bg-img-*`。
- `rg` 確認 tenant wrapper 保留必要的 tenant resource / config。
- `git diff --check`。

需 RD 確認後再執行：

- Nuxt prepare。
- 目標 Nx project build / lint。
- browser smoke test。
- 跨 tenant 回歸檢查。

## 輸出補充

回覆需列出：

- 目標 feature 與 tenant。
- 搬到 shared 的檔案。
- 保留在 tenant 的檔案與原因。
- 移除的 passthrough wrapper。
- 是否改變 route path、storage key、auto-import 或 public asset boundary。
- 已執行與未執行的驗證。

## 完成與驗收

- Shared 檔案不依賴 tenant public asset 或 tenant-only config。
- Tenant wrapper 只保留有明確 tenant 客製理由的內容。
- Shared feature component 位於 domain folder，`Base*` root 不動。
- Imports 已同步，舊路徑無殘留。
- Nuxt duplicated imports warning 已檢查或列為待驗證。
- 未執行的 build、lint、Nuxt prepare 或 browser smoke test 有明確列出。
