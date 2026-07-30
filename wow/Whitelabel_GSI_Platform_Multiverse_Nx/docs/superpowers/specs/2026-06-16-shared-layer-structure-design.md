# Shared Layer Structure Design

## Goal

建立 `libs/shared/ui-layer` 的共用優先分層規則，先整理 shared feature component 與 Base component 的邊界，避免 feature component 全部堆在 `components/` 根目錄。

## Decisions

- 採 shared-first：有共用能力先放 `libs/shared/ui-layer`，沒有共用或高度客製才放 `apps/<tenant>`。
- 第一階段只整理 `src/lib/components/`；route ownership 維持現狀，不搬 shared route。
- 後續可採混合 route ownership：共用功能可以放 shared layer `pages/`；敏感、高客製、tenant-specific flow 保留在 tenant `pages/`。
- Tenant 可透過同路徑 page 覆寫 shared route，或用 wrapper 引用 shared component 並傳 props / `classObj`。

## Route Layer

```txt
libs/shared/ui-layer/pages/
  <optional shared routes>
```

- 只放 Nuxt route wrapper。
- 只 import shared feature page component。
- 不放 API call、狀態管理、資料 mapping 或複雜 UI。
- 新增 shared route 前需確認該 route 可被所有 extend shared layer 的 tenant 看見，或可由 menu / visibility / auth gate 控制。
- 第一階段不新增或搬移 route。

```txt
apps/<tenant>/src/pages/
```

- shared 沒有該 route 時才新增。
- tenant 需要特殊 route path、layout、middleware、flow 或 brand-specific behavior 時才新增。
- 若同路徑存在，可作為 tenant override。

## Component Layer

`Base*` 元件維持在 `components/` 根目錄，不搬動：

```txt
libs/shared/ui-layer/src/lib/components/
  BaseBtn.vue
  BaseInput.vue
  BaseTable.vue
  BaseSelect.vue
```

功能元件依 domain 建資料夾：

```txt
libs/shared/ui-layer/src/lib/components/
  referral-rebate/
    ReferralRebatePage.vue

  agent-collaboration/
    AgentCollaborationPage.vue

  announcement-center/
    AnnouncementCenterPage.vue
    AnnouncementCenterPanel.vue
    AnnouncementCenterOverlay.vue

  claim-gift/
    ClaimGiftDialog.vue
    ClaimGiftFloatingEntry.vue
```

規則：

- `Base*` 元件不依賴 domain API、domain composable 或特定 feature state。
- Domain component 可以依賴 shared domain composable、i18n key、API types 與 Base components。
- `*Page.vue` 是 feature page component，不是 Nuxt route page。
- Dialog、panel、floating entry 等若屬特定功能，放進同一 domain folder。

## Data Layer

第一階段不調整下列目錄：

```txt
src/lib/composables/
src/lib/api/
src/lib/constants/
```

原因：

- 先降低 migration 風險。
- 目前主要混亂集中在 `components/`。
- 若後續 domain 檔案增加，再討論 `features/<domain>` 或 `composables/<domain>`。

## Migration Order

1. 先整理 shared feature components 到 domain folder。
2. 更新 tenant wrapper imports。
3. 更新 shared component 內部相對 imports。
4. 保持 `Base*` root import 不變。
5. 每次只搬一個 domain，避免大範圍 import churn。

## Current Examples

- `referralRebate`：目前 r017 是 thin wrapper，引用 shared feature component，並承接 r017 背景資源；第一階段只搬 component folder。
- `agent-collaboration`：目前 r017 是 thin wrapper + `pageSize` / `classObj`，引用 shared feature component；第一階段只搬 component folder。
- `announcement-center`：目前 r017 page 是 thin wrapper + `classObj`，保留 r017 背景資源；overlay 不依賴 r017 asset，搬到 shared component folder，並使用 player-scoped storage key。
- `claim-gift`：目前 r017 只保留 layout-level floating entry wrapper，承接 r017 圖片、mock adapter 與 storage key；dialog 留在 shared，不保留 tenant passthrough wrapper。
- `referral/index.vue`：目前仍持有 tenant-local tab / sub-detail state 與 local components，暫不搬。

## Validation

- Route migration 後需確認 Nuxt route 仍存在。
- Component migration 後需跑 focused type / build 或至少 Nuxt prepare。
- Visual route 應做人工或 browser smoke check。

## Open Questions

- 是否要讓 `collaboration` 與 `announcement` 也進入 shared route。
- `classObj` 是否長期保留，或改成更語意化的 theme props。
- 第二階段是否要導入 `features/<domain>` 統一收斂 component / composable / api / constants。
