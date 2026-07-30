# Shared Claim Gift Design

## 背景

Commit `4bdfb77512c755738385837910a4b7e5864a4560` 新增了 claim gift 功能。該 commit 已將 API hook、gift store 與 `BaseFloatingAction` 放在 `libs/shared/ui-layer`，但功能 UI 與流程仍放在 `apps/r017`。

目標是把 claim gift 搬到 shared UI layer，讓其他版型 app 可以復用同一套 DOM、行為與響應式樣式。版型 app 只需要提供圖片、storage key 與顏色 theme。

## 範圍

將可復用的 claim gift 功能搬到 `libs/shared/ui-layer`：

- Shared composable，負責 claim gift flow 狀態與資料 mapping。
- Shared floating entry component。
- Shared claim dialog component。
- Shared 預設 gift 圖片。
- local/demo mode 可選 mock data 支援。
- r017 改為消費 shared feature。

保留版型 app 專屬資產與 runtime wiring 在 `apps/r017`：

- r017 gift 圖片覆蓋。
- r017 浮動位置 storage key。
- r017 layout placement。
- r017 顏色 token 覆蓋，僅在與 shared default 不同時提供。

## 架構

### Shared Composable

新增 `libs/shared/ui-layer/src/lib/composables/useClaimGiftFlow.ts`。

職責：

- 透過既有 `useGiftList` 讀取 gift list。
- 透過既有 `useClaimGift` 領取 gift。
- 成功領取後 refetch gift list 與 wallet list。
- 在 mock mode 啟用時支援 mock data。
- 正規化 gift options，移除金額為零或無效的選項。
- 推導 current gift、badge count、currency options、selected amount、amount range、gift type label、wallet type label 與 dialog state。
- 從 current gift 與 selected currency 建立 `ClaimGiftParamsType`。
- 在使用者未登入、位於 guest-only route，或沒有可領取 gift 時隱藏 floating entry。

輸入：

- `storageKey: string`。
- `mockAdapter?: ClaimGiftMockAdapter`。
- `hiddenRoutePaths?: string[]`。
- `useMockData?: boolean | Ref<boolean> | ComputedRef<boolean>`。

輸出：

- 目前 `useR017ClaimGift` 回傳的既有狀態。
- floating action 使用的 `storageKey`。
- `openDialog`、`closeDialog`、`confirmSuccess`、`claimCurrentGift`。

### Shared Components

新增 `libs/shared/ui-layer/src/lib/components/ClaimGiftFloatingEntry.vue`。

職責：

- 擁有完整 floating entry 與 dialog wiring。
- 使用 `BaseFloatingAction`。
- 使用 `useClaimGiftFlow`。
- 只接受穩定的版型 app 設定。

主要 props：

- `storageKey: string`。
- `entryImageSrc?: string`。
- `claimImageSrc?: string`。
- `imageAlt?: string`。
- `theme?: ClaimGiftTheme`。
- `mockAdapter?: ClaimGiftMockAdapter`。
- `hiddenRoutePaths?: string[]`。

新增 `libs/shared/ui-layer/src/lib/components/ClaimGiftDialog.vue`。

職責：

- 保留目前 claim/success DOM 結構、響應式行為與動畫。
- 接收 image source、resolved text、claim state、currency options 與 color theme。
- emit claim、close、success confirm 與 selected currency updates。

### 圖片

Shared 擁有預設 gift 圖片，讓 feature 在沒有版型 app 設定時也能運作。

建議路徑：

- `libs/shared/ui-layer/src/public/images/claim-gift/default-floating-gift.png`

r017 可用以下路徑覆蓋：

- `/images/claim-gift/floating-gift.png`

如果 shared layer 目前尚未使用 public asset 行為，實作時需先確認 Nuxt layer asset resolution，再決定最終路徑。

## 文案策略

優先使用既有 i18n key。如果 key 不存在，則 fallback 到 component 內建英文。

優先順序：

1. Explicit `texts` override，若後續加入。
2. Explicit `textKeys` override，若後續加入且 `te(key)` 為 true。
3. Shared default i18n key，且 `te(defaultKey)` 為 true。
4. Built-in English fallback。

初始實作可以先保持 public API 較小，只使用 default i18n keys 與英文 fallback。只有當某個版型 app 需要不同文案時，才加入 `texts` 或 `textKeys`。

可復用既有 key：

- `menu.getMoney`
- `btn.confirm`
- `common.get_currency`
- `gift_type.birthday`
- `gift_type.level_up`
- `common.gift_wallet`
- `table_header.claim_amount`

缺少文案時使用的英文 fallback：

- Open gift claim
- Claim
- Claiming
- Close
- Congratulations
- You get
- PICK AND WIN

## Theme 策略

版型 app 不應為此 feature 重寫 local CSS。Shared 負責 DOM、layout、animation、responsive CSS 與 default visual styling。

版型 app 只可覆蓋 color tokens 與 image assets。

建議 `ClaimGiftTheme`：

```ts
interface ClaimGiftTheme {
  primaryFrom?: string
  primaryTo?: string
  overlayBg?: string
  successCardBg?: string
  successHeaderBg?: string
  badgeBg?: string
  textColor?: string
}
```

Shared component 會將 theme values 轉成 CSS variables，例如：

- `--claim-gift-primary-from`
- `--claim-gift-primary-to`
- `--claim-gift-overlay-bg`
- `--claim-gift-success-card-bg`
- `--claim-gift-success-header-bg`
- `--claim-gift-badge-bg`
- `--claim-gift-text-color`

初始 public API 不加入 `classObj`，除非實作時發現有真實需求。目前需求是只做顏色客製。

## r017 Wiring

將 r017 local feature implementation 改成消費 shared。

`apps/r017/src/layouts/default.vue` 仍繼續 render claim gift entry，但 render 的 component 應改來自 shared。

範例用法：

```vue
<ClaimGiftFloatingEntry
  storage-key="r017.claimGift.floatingPosition"
  entry-image-src="/images/claim-gift/floating-gift.png"
  :theme="{
    primaryFrom: '#ff7a16',
    primaryTo: '#ef2338',
    overlayBg: 'rgb(0 0 0 / 64%)',
    successCardBg: '#20116b',
    successHeaderBg: '#3b24a5',
    badgeBg: '#ef4444',
    textColor: '#ffffff'
  }"
/>
```

Shared migration 後，以下 r017 檔案可移除或縮小：

- `apps/r017/src/components/claimGift/ClaimGiftDialog.vue`
- `apps/r017/src/components/claimGift/ClaimGiftFloatingEntry.vue`
- `apps/r017/src/composables/useClaimGift/index.ts`
- `apps/r017/src/composables/useClaimGift/mockData.ts`

保留：

- `apps/r017/src/public/images/claim-gift/floating-gift.png`

## 錯誤處理

- 使用者未登入時，不顯示 floating entry。
- 目前 route 是 guest-only route 時，不顯示 floating entry。
- 沒有 valid gifts，或所有 options 都是非正數金額時，不顯示 floating entry。
- 無法建立 claim payload 時，忽略 claim action。
- Claim API 回傳 unsuccessful status 時，保留 dialog 開啟，不顯示 success。
- Mock data 啟用時，從 mock list 移除已領取 gift 並顯示 success。

## 測試

建議針對 shared composable 做 focused unit tests：

- 正規化 gift list 並移除 invalid options。
- 計算 badge count 與 selected amount range。
- 依 selected currency 建立 claim payload。
- 在 logged-out、guest-only route、empty gift list 狀態下隱藏 entry。
- Mock mode 啟用時使用 mock adapter。

實作後建議做 manual/browser QA：

- r017 desktop 與 mobile 浮動位置。
- 開啟 dialog、claim flow、success state、close behavior。
- Image override 是否正常 render。
- i18n fallback 不顯示 raw missing keys。
- Theme colors 與目前 r017 implementation 一致。

## 驗收標準

- Claim gift UI 與 flow 可從 `libs/shared/ui-layer` 復用。
- r017 不再擁有重複的 claim gift DOM 或 flow logic。
- r017 只提供 storage key、可選 image override 與 color theme。
- 既有 shared API hooks 保持 API boundary。
- 保留 commit `4bdfb77512c755738385837910a4b7e5864a4560` 的既有 gift 行為。
- r017 color-only customization 不需要 template-app-local CSS。
