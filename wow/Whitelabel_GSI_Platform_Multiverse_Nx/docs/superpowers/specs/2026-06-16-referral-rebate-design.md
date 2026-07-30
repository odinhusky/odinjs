# Referral Rebate Design

## 背景

本需求是在 r017 前台新增「上級返佣」模組。使用者已提供設計資源與 API 參考文件，並指定此需求為大範圍變更，因此本 spec 只描述已確認的產品、架構與驗收邊界；後續需經使用者或 RD/reviewer 確認後，才可進入 implementation plan 與實作。

## 治理與審核

- 本任務採大範圍變更流程。
- 實作前必須先完成 spec review，再撰寫 implementation plan。
- 實作階段必須採 TDD 思路：可測邏輯先寫失敗測試，再實作。
- 未經使用者授權，不執行 `git add`、`git commit`、`git push`、dev server、browser visual QA、lint、build 或完整測試。
- RD/reviewer 審核 gate：本 spec 完成後先停下，等待使用者或 RD/reviewer 確認。

## 來源資料

### 設計資源

- Zip：`/Users/aiden.chen/Documents/Codex/2026-06-15/files-mentioned-by-the-user-r017/outputs/R017_assets_svg_png_25_58_20260616_122713.zip`
- 補充細項設計稿：`/Users/aiden.chen/Downloads/pc 5/上級返水/返佣明細.png`

設計資源包含四組必要驗收 breakpoint：

- `1920`
- `1439`
- `992`
- `375`

資源包同時包含資料狀態與 `no_data` 狀態。實作時需依這四個 breakpoint 做人工視覺驗收；若資源檔命名無法判斷語意，需列出檔名請 RD/設計確認，不得自行假設。

### API 參考

- `/Users/aiden.chen/jStar/Whitelabel_GSI_Platform_Multiverse/referral-rebate-api-structure.md`

本 repo 已存在部分 `referralRebate_*` API wrapper，但仍需補齊 access gate、query hooks 與頁面資料流。

## 已確認範圍

### Route 與入口

- 新增 route：`/referralRebate`
- Nuxt page wrapper：`apps/r017/src/pages/referralRebate/index.vue`
- CMS/menu did：`referral_rebate`
- r017 side menu resolver 需補 mapping：`referral_rebate -> ROUTE_PATH.REFERRAL_REBATE`
- 不新增固定 side menu item；入口顯示由 CMS/menu API 控制。

### Auth 與 Access Gate

- `/referralRebate` 需加入登入保護。
- 未登入使用者進入 `/referralRebate` 時，依既有 auth middleware 導向 `/login`。
- 已登入後，頁面需先呼叫 `GET /v1/player/referral_rebate/group`。
- `/group` 通過後才渲染上級返佣內容，並開始呼叫 summary、statement、events 等資料 API。
- `/group` 不通過或無有效資料時：
  - 留在 `/referralRebate`。
  - 顯示共用 empty/NoData。
  - 不渲染上級返佣內容。
  - 不呼叫 summary、statement、events 或 event detail API。

`rebate_target` 判斷：

```ts
enum ReferralRebateTarget {
  All = 1,
  Member = 2,
  Agent = 3
}

allowed =
  rebate_target === ReferralRebateTarget.All ||
  (rebate_target === ReferralRebateTarget.Member && !isMemberAgent) ||
  (rebate_target === ReferralRebateTarget.Agent && isMemberAgent)
```

`isMemberAgent` 使用既有登入使用者資料中的 `is_member_agent`。

### 架構

採 shared-first：

- `libs/shared/ui-layer`
  - 上級返佣 API wrapper、types、query keys、TanStack Query hooks。
  - 上級返佣 shared page component。
  - 上級返佣 composable：管理 access gate、currency、date range、tabs、filters、pagination、detail state 與 API payload mapping。
  - 上級返佣 UI components：summary cards、tabs、filters、desktop tables、mobile cards、detail table、empty/error/loading blocks。
- `apps/r017`
  - `src/pages/referralRebate/index.vue` thin wrapper。
  - `src/composables/useSideMenu/resolver.ts` did mapping。
  - 必要時傳入 r017 class/theme config；不得複製 shared page flow 到 local。

## 資料流

### 初始化

1. Auth middleware 先處理未登入狀態。
2. Shared page 啟動 access gate query：`GET /v1/player/referral_rebate/group`。
3. Access gate 通過後初始化幣別。
4. 幣別優先使用 active wallet currency；若無法取得，使用可用幣別第一筆。
5. 初始化日期為今天往前 7 天，格式為 `YYYY-MM-DD`。
6. 載入推薦碼與當期 summary。
7. 依目前 tab 載入下級投注報表或返佣明細。

### Summary Cards

- 推薦碼：`GET /v1/player/commission/me/referral/info`
- 當期總計：`GET /v1/player/referral_rebate/events/current/summary`

顯示內容：

- 專屬推薦碼。
- 最新一期總有效投注額：`valid_bet_amount`
- 最新一期返佣金額：依 API response 使用 `revenue_amount` 或 `profit`，標題需依 `calculate_type` 使用對應 i18n key。

### 下級投注報表

API：

```txt
GET /v1/player/referral_rebate/events/current/statement
```

Query：

```ts
{
  currency_id: number
  account?: string
  game_type?: number
  start_time?: string
  end_time?: string
  offset: number
  size: number
}
```

規則：

- `game_type = 0` 表示全部，request 不送 `game_type`。
- 搜尋時更新 submitted filters，並將 page 重置為 1。
- 分頁使用 `offset = (page - 1) * size`。

### 返佣明細

API：

```txt
GET /v1/player/referral_rebate/events
```

Query：

```ts
{
  currency_id: number
  start_time: string
  end_time: string
  offset: number
  size: number
}
```

點擊 `查看細項` 後，在同一個 `/referralRebate` 頁面記錄 selected event，切換到細項表狀態。

### 返佣明細細項

API：

```txt
GET /v1/player/referral_rebate/events/{event_id}/statement
```

Query：

```ts
{
  account?: string
  game_type?: number
  currency_id: number
  offset: number
  size: number
}
```

規則：

- `event_id` 只放 path param，不重複放進 query。
- `game_type = 0` 表示全部，request 不送 `game_type`。
- 按 `回上一層` 清除 selected event，返回 `返佣明細` tab。
- 不新增 `/referralRebate/event/[eventId]` dynamic route。

## UI 設計

### Page Header

- 標題：上級返佣。
- 幣別 select 位於標題下方。
- Summary cards：
  - 專屬推薦碼，含分享與複製 icon button。
  - 最新一期總有效投注額。
  - 最新一期返佣金額。

### Tabs

- `下級投注報表`
- `返佣明細`

Desktop/tablet 為橫向 tab。Mobile 兩個 tab 各占一半寬度。

### Filters

下級投注報表：

- 會員帳號
- 遊戲類型
- 搜尋時間
- 搜尋按鈕

返佣明細：

- 結算時間
- 遊戲類型
- 搜尋按鈕

細項表：

- 會員帳號
- 搜尋按鈕

Desktop/tablet 以橫向排列為主；`992` 以下允許換行；`375` mobile 直向排列。

### Tables 與 Cards

Desktop/tablet 使用 shared `BaseTable`。

下級投注報表欄位：

- 會員帳號
- 返佣層級
- 會員存款
- 幣別
- 遊戲類別
- 有效投注額
- 盈虧

返佣明細欄位：

- 結算時間
- 幣別
- 總有效投注額
- 總盈虧
- 總返佣金額
- 派發日期
- 操作

細項表欄位：

- 會員帳號
- 返佣層級
- 佣金比例
- 幣別
- 有效投注額
- 盈虧
- 返佣金額

Mobile 不硬縮 desktop table，需使用對應 mobile card：

- 返佣明細 mobile card 支援展開/收合。
- 展開後顯示總盈虧、總返佣金額、派發日期與查看細項按鈕。
- 下級投注報表與細項表使用 mobile card 展示主要欄位。

### Empty、Loading、Error

- Access gate 不通過：顯示共用 empty/NoData。
- API list 為空：顯示共用 empty/NoData。
- 資源包 no_data 狀態需納入人工驗收。
- Loading 使用 `BaseTable` loading 或 mobile loading block。
- Error 顯示可重試區塊；所有文案使用 i18n key。

## i18n

所有 UI 可見文字都必須使用 i18n key：

- 頁面標題。
- tab。
- filter label。
- placeholder。
- button。
- table header。
- mobile card label。
- empty/loading/error。
- toast summary/detail。
- `aria-label`。
- 圖片 `alt`。

限制：

- 不硬碼中文或英文。
- 不使用 `te(key) ? t(key) : "fallback"` 這類硬碼 fallback。
- 不新增或修改本地 locale JSON。
- 實作前需比對遠端 `zh-TW` 與 `en` locale key。
- 缺 key 時先列給 RD 補翻譯，不用硬碼文案代替。

Enum 顯示：

- `game_type` 使用 constants 對應 i18n key。
- `calculate_type` 使用 constants 對應 i18n key。
- 若找不到既有 key，列為 RD 翻譯缺口。

## API 與 Shared 資源調整

需要補齊：

- `ENDPOINT_PATHS.REFERRAL_REBATE.GROUP`
- `referralRebate_getReferralRebateGroup`
- referral rebate query keys
- referral rebate TanStack Query hooks
- referral rebate access gate composable 或 page-level query enabled gate

可復用：

- `referralRebate_getReferralRebateSummary`
- `referralRebate_getReferralRebateStatement`
- `referralRebate_getReferralRebateEvents`
- `referralRebate_getReferralRebateEventsStatements`
- `referral_getReferralInfo`
- `useReferralInfoQuery`
- `useAvailableCurrencyList`
- `formatMoney`
- `BaseTable`
- `BaseSelect`
- `BasePagination`
- `NoData`

需要修正或強化：

- 既有 event detail wrapper 目前會把完整 params 傳進 request，其中包含 `event_id`。新流程應只把 `event_id` 放在 path，除非 API owner 明確要求 query 也需要 `event_id`。
- 既有 referral rebate API wrappers 需要支援 optional params，因為全部類型搜尋時會省略 `account` 與 `game_type`。

## 驗收標準

### Functional

- 未登入進 `/referralRebate` 會導向 login。
- CMS did `referral_rebate` 可解析到 `/referralRebate`。
- `/group` 通過時才顯示上級返佣內容。
- `/group` 不通過時顯示 empty/NoData，且不呼叫後續資料 API。
- 幣別切換會重新載入 summary 與目前 tab 資料。
- 下級投注報表搜尋會套用 account、game type、date range。
- 返佣明細搜尋會套用 date range、game type。
- `查看細項` 會在同頁切換到細項表。
- `回上一層` 會回到返佣明細 tab。
- 分頁送出正確 offset 與 size。

### Visual

- `1920 / 1439 / 992 / 375` 四個 breakpoint 都需人工驗收。
- Desktop/tablet table layout 不應溢出內容區。
- `375` mobile 使用 card layout，不顯示硬縮 table。
- no data 狀態需符合設計稿意圖。

### i18n

- 目標範圍內沒有硬碼中文或英文 UI 文案。
- 使用到的 i18n key 已確認存在於遠端 `zh-TW` 與 `en`。
- 未修改本地 locale JSON。

### Tests

- Shared composable 的 payload mapping、access gate、pagination、detail state 需有單元測試。
- API hooks/query enabled gate 需有 focused tests 或 source-level tests。
- UI component tests 需至少覆蓋 tab switching、detail enter/back、group denied empty state、mobile card 展開資料 mapping。

## 不做項目

- 不新增固定 side menu item。
- 不新增 runtime mock。
- 不新增 `/referralRebate/event/[eventId]` route。
- 不修改 production、staging、遠端資料、CMS 設定或翻譯平台。
- 不新增或修改本地 locale JSON。
- 不在未授權狀況下啟動 dev server、跑 browser visual QA、lint、build 或完整測試。

## 待 RD/reviewer 確認

- CMS/menu 後台會下發 did：`referral_rebate`。
- `/group` 不通過時使用通用 NoData 可接受。
- 遠端 locale 已有本頁所需 key；缺 key 由 RD 補翻譯。
- 若 API owner 要求 `events/{event_id}/statement` query 也帶 `event_id`，需明確通知前端調整。
- 視覺驗收時若資源包中某些檔案用途不明，由 RD/設計標註對應畫面。
