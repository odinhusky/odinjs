# 禮金浮動入口設計

## 背景

本文件描述 `whitelabel-gsi-platform-multiverse-nx` 中 R017 的禮金領取功能設計。

參考資料：

- API contract：`/Users/aiden.chen/jStar/Whitelabel_GSI_Platform_Multiverse/claim-gift-structure.md`
- 設計參考 SVG：`/Users/aiden.chen/Downloads/R017_優化中.svg`
- 目標 tenant：`apps/r017`

本功能屬於大範圍變更。實作必須遵守本次治理文件、root `AGENTS.md`、root `SKILL.md`，以及對應的 repo-local skills。

## 目標

- R017 登入使用者有可領禮金時，顯示可拖曳的禮金浮動按鈕。
- 浮動按鈕顯示目前可領禮金筆數 badge。
- 使用者點擊浮動按鈕後開啟禮金領取彈窗。
- 支援多筆可領禮金，但彈窗內不做清單式列表。
- 支援單筆禮金有多個 currency option。
- 一次領取一筆禮金；成功後刷新禮金與錢包狀態，再接續下一筆。
- 提供本地 mock 行為，方便測試有禮金、多筆禮金與多幣別情境。

## 非目標

- 不處理 admin 或 agent 禮金管理。
- 不新增交易紀錄功能；交易紀錄仍由後端入帳後回傳既有 record。
- 不把禮金業務 UI 做成所有 tenant 共用。
- 不新增細分 mock scenario 的環境變數。
- 第一版不新增單獨的 `/member/gift` route page。

## 架構

### Shared UI Layer

在 `libs/shared/ui-layer` 新增可重用的 draggable floating button 基底元件。

職責：

- 渲染 fixed position 的浮動操作容器。
- 支援 mouse 與 touch 拖曳。
- 透過小距離門檻判斷點擊或拖曳，預設門檻為 `6px`。
- 將拖曳範圍限制在 viewport 內。
- 放開拖曳後吸附到較近的左側或右側邊緣。
- 將最後位置保存到 `localStorage`。
- 透過 prop 或 slot 接收 badge 內容。
- 不包含 tenant-specific 的禮金文案、圖片資產或 claim gift API 邏輯。

此 shared component 是通用浮動互動基底，不是 shared 禮金功能。

### R017 App Layer

在 `apps/r017` 新增 R017 禮金功能組裝。

職責：

- 使用 shared draggable floating button 基底。
- 使用從指定 SVG 裁切出的 R017 禮金浮動按鈕資產。
- 只有 normalized 後存在可領禮金時才顯示浮動按鈕。
- 只有登入使用者才顯示浮動按鈕。
- 排除 login、register、forgot password 等 guest-only routes。
- 控制禮金領取彈窗開關與狀態。
- 套用 R017-specific 樣式、文案與輕量動畫。
- 當 `NUXT_PUBLIC_SHOW_MOCK_DATA=true` 時，提供 app-local mock gift state。

### API Layer

目前 repo 已有以下禮金相關基礎：

- `ENDPOINT_PATHS.GIFT.LIST`
- `ENDPOINT_PATHS.GIFT.CLAIM`
- `gift_getGiftList.ts`
- `useGiftList.ts`
- gift store
- gift query key

實作時應在 shared API layer 補強既有 claim gift API wrapper 型別，並新增 mutation hook。

Claim payload：

```ts
interface ClaimGiftData {
  gift_id: number
  amount: number
  currency: number
}
```

領取成功後：

- 刷新 gift list。
- 刷新 wallet list。
- 顯示成功狀態。
- 彈窗保持開啟；若仍有下一筆禮金，切換到下一筆。

## 資料處理

渲染前先 normalize gift list：

- 移除 `amount` 無法轉成正數的 options。
- 移除沒有任何可領 options 的 gifts。

浮動 badge 計數：

- 計算可領 gift 筆數，不計算 options 筆數。
- 例如原本 `97` 筆 gifts，成功領取並刷新後變成 `96`。

目前禮金選擇：

- 彈窗一次只顯示一筆目前禮金。
- 使用第一筆可領 gift 作為目前禮金。
- 成功領取並刷新後，下一筆可領 gift 成為目前禮金。

Currency 處理：

- 若目前禮金有多個 currency options，彈窗顯示 `Currency` selector。
- 使用者只選擇 currency。
- `amount` 不可編輯。
- claim payload 的 `amount` 取自 API 回傳的 selected currency option。
- 若同一 currency 有多筆 options，使用 API array 中 index 最小的 option。

## 浮動按鈕互動

顯示規則：

- 僅 R017。
- 僅登入使用者。
- 沒有可領禮金時隱藏。
- guest-only routes 隱藏。

位置：

- Desktop：依 SVG 方向放在右側浮動位置。
- Mobile：放在右下角，避開 mobile bottom navigation。
- Badge 位於按鈕右上角，並跟著按鈕移動。

拖曳行為：

- 移動距離小於 `6px` 視為 click。
- 移動距離大於或等於 `6px` 視為 drag，放開時不可開啟彈窗。
- 放開後吸附到最近的水平邊緣。
- 位置保存到 `localStorage`。
- 邊界邏輯必須避免按鈕被拖出畫面。

動畫：

- 浮動按鈕可使用輕量 idle motion，例如 breathing 或 subtle shake。
- 彈窗開關使用簡單 transition。
- 成功領取後顯示短暫成功狀態，再切換到下一筆。

## 彈窗行為

彈窗不是清單式 UI。

彈窗顯示：

- Gift type label，例如 level-up gift 或 birthday gift。
- Wallet type label，若對使用者有幫助才顯示。
- 多幣別時顯示 Currency selector。
- Selected currency 的 read-only amount。
- Claim button。
- Loading 與 claiming states。
- Claim 成功後的 success state。
- 若彈窗開啟期間資料變空，顯示 empty state。

失敗處理：

- Gift list 讀取失敗時，盡可能保留前一次可見狀態。
- Claim 失敗時不刷新 wallet list。
- Claim 失敗時保留目前 gift 與 selection，讓使用者可重試或關閉。
- 錯誤訊息可由 API layer 或既有 toast flow 顯示。
- Token 失效依既有 auth behavior 處理。

## Mock 行為

Mock 沿用 R017 既有 pattern：

- 讀取 `runtimeConfig.public.SHOW_MOCK_DATA`。
- 只有 `NUXT_PUBLIC_SHOW_MOCK_DATA=true` 時啟用 mock gift data。
- 本版不新增細分 mock scenario 的環境變數。

Mock dataset 應包含：

- 多筆 gifts，用於測試 badge count 與連續領取。
- 至少一筆 gift 具有多個 currency options。
- 至少一筆簡單的 single-currency gift。

Mock claim 行為：

- Claim 在本地成功。
- Claim 後從 mock state 移除目前 gift。
- 從 mock state 重新計算 gift count。
- Badge 可遞減，例如從 `97` 變成 `96`。

此 mock 僅限 R017 app-local，不應影響 production API behavior。

## 資產

使用指定 SVG 作為設計參考。

浮動禮金按鈕資產改用 RD 指定的乾淨 PNG：`/Users/aiden.chen/Downloads/⭕ 禮金明細/img/gift_detail.png`，並將檔案放到 `apps/r017/src/public/images/claim-gift/floating-gift.png`。

不應將原始大型 SVG 整張匯入 app。

## 預期影響檔案或範圍

可能觸碰的範圍：

- `libs/shared/ui-layer/src/lib/components`：可重用 draggable floating button。
- `libs/shared/ui-layer/src/lib/api/apiFunctions`：claim gift API wrapper。
- `libs/shared/ui-layer/src/lib/api/hooks`：claim mutation。
- `apps/r017/src/components`：R017 claim gift floating entry 與 dialog。
- `apps/r017/src/composables`：R017 claim gift state、mock behavior 與 orchestration。
- `apps/r017/src/public/images`：裁切後的 floating gift asset。
- R017 root layout 或 app shell：全站掛載 floating feature。

實際檔名應在 implementation planning 階段依鄰近 repo pattern 決定。

## 驗證計畫

未經 RD 授權，不執行驗證指令。

實作完成後建議的 focused validation：

- 若可用且獲授權，對 touched Nx project 執行 static/lint check。
- 若獲授權，對 `r017` 執行 build check。
- 若獲授權，執行 browser smoke test：
  - logged-out routes 不顯示浮動按鈕
  - logged-in mock mode 且有 gifts 時顯示浮動按鈕
  - badge count 正確顯示
  - 拖曳可移動並保存位置
  - click 可開啟彈窗
  - currency selector 可切換 amount
  - claim success 後 badge 遞減並前進到下一筆
  - no-gift state 隱藏浮動按鈕

本 spec 的 docs-only validation：

- 檢查是否有未完成 placeholder。
- 檢查是否與已確認需求互相矛盾。
- 檢查實作範圍是否維持在 shared floating primitive 與 R017 gift feature。

## 待授權事項

實作必須等待 RD 確認本 spec，並確認後續 implementation plan。

依專案治理規則，git commit、staging、branch changes、install commands、service startup、full build 與 browser validation 都需要明確授權。
