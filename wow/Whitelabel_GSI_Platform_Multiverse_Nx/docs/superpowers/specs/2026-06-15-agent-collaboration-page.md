# Agent Collaboration Page Design

## 背景

本需求要依設計稿實作會員端合營代理頁。此頁是獨立路由頁，進入後查詢合營代理功能是否開放，並顯示統計資訊、推薦碼、邀請明細與返佣明細。

API 規範參考：

- `/Users/aiden.chen/jStar/Whitelabel_GSI_Platform_Multiverse/agent-collab-api-structure.md`

設計稿來源：

- `/Users/aiden.chen/Downloads/R017_優化中 (1).svg`
- 使用者提供的 PC、平板、手機截圖。

## 已確認決策

- 路由使用 `/collaboration`。
- `visibility=false` 時，側欄不顯示入口；直接進 `/collaboration` 時顯示空狀態。
- 本次只做「邀請明細」與「返佣明細」。
- API 直接接既有 shared API wrapper，不先做 mock flow。

## 範圍

本次實作一個合營代理頁：

- 新增 `/collaboration` route。
- 側邊欄新增合營代理入口，並受 visibility API 控制。
- 進頁後查詢 visibility。
- visibility 開放時載入統計資訊與當前 tab 明細。
- 支援幣別選擇，預設優先使用目前 active wallet currency，否則使用第一個可用幣別。
- 支援推薦碼顯示與複製。
- 支援「邀請明細」tab。
- 支援「返佣明細」tab。
- 支援搜尋、狀態篩選、日期篩選與分頁。
- 支援 PC、平板與手機版設計稿斷點。
- 圖片使用 shared `BaseImage.vue`，相對路徑以 `NUXT_PUBLIC_IMAGE_BASE` 組完整 URL。

不做：

- 不做 `GET /domains` 網域列表。
- 不做 `POST /domains` 新增網域申請。
- 不做 mock / API 切換開關。
- 不做後台管理功能。
- 不做權限設定頁。
- 不新增 production / staging 設定。
- 不主動修改 API contract。

## 斷點與版型

依設計稿分為三段：

- `1440px` 以上：PC。
- `769px ~ 1439px`：平板。
- `768px` 以下：手機。

PC 與平板：

- 內容位於頁面主內容區，不覆蓋為 dialog。
- 上方顯示頁名、banner、幣別 select 與統計卡片。
- 下方顯示 tab、filter row、table panel 與分頁。
- 頁面背景沿用 r017 深色背景與 footer layout。

手機：

- 寬度貼合 viewport。
- 上方顯示頁名、banner、幣別 select 與統計卡片。
- filter 以單欄呈現。
- 明細以 card list 呈現，不使用桌面 table。
- card 可呈現主要資訊，必要時展開補充欄位。
- 分頁位於列表底部。

## API Contract

既有 shared API wrapper 可復用：

- `getCollaborationVisibility`
- `getCollaborationStatistics`
- `getInvitations`
- `getRebates`

既有 endpoint：

```txt
GET /v1/player/agent_collab/visibility
GET /v1/player/agent_collab/statistics
GET /v1/player/agent_collab/invitations
GET /v1/player/agent_collab/rebates
```

本次不接：

```txt
GET /v1/player/agent_collab/domains
POST /v1/player/agent_collab/domains
```

### Visibility

`GET /visibility` 回傳 truthy 時顯示功能。

處理規則：

- 側欄入口只在 visibility truthy 時顯示。
- 使用者直接進 `/collaboration` 且 visibility falsy 時，頁面顯示空狀態。
- visibility 查詢失敗時，頁面顯示錯誤或空狀態，不顯示假資料。

### Statistics

`GET /statistics` request：

```ts
type GetCollaborationStatisticsParams = {
  lang: string
  currency_id: number
}
```

顯示欄位：

- `banner` 或 `banner_path`。
- `referral_code`。
- `active_member_count`。
- `valid_bet_amount`。
- `title`。
- `detail`。

處理規則：

- `lang` 使用目前語系，例如 `zh-TW`。
- 幣別改變時重新查詢 statistics。
- banner 顯示使用 `BaseImage.vue`。
- detail 若為 HTML，本次需以安全策略決定是否純文字顯示；未確認前不使用 `v-html`。

### Invitations

`GET /invitations` request：

```ts
type GetInvitationsParams = {
  member_account?: string
  currency_id: number
  status?: INVITATION_STATUS_ENUMS
  offset: number
  size: number
}
```

處理規則：

- `member_account` 送出前 `trim()`，空字串不送。
- `offset = (page - 1) * pageSize`。
- `size = 10`。
- 幣別改變時重設 page 並重新查詢。
- 搜尋或狀態篩選改變時重設 page。

桌面欄位：

- 會員帳號。
- 存款次數。
- 幣種。
- 存款金額。
- 有效投注金額。
- 狀態。

手機 card：

- 顯示會員帳號、日期或主要識別、狀態與核心金額。
- 展開後顯示存款次數、幣種、存款金額、有效投注金額。

### Rebates

`GET /rebates` request：

```ts
type GetRebatesParams = {
  start_time: string
  end_time: string
  currency_id: number
  offset: number
  size: number
}
```

處理規則：

- 日期格式依 API 規格送 `YYYY/MM/DD`。
- `offset = (page - 1) * pageSize`。
- `size = 10`。
- 幣別或日期改變時重設 page。

桌面欄位：

- 結算時間。
- 達成活躍會員人數。
- 幣種。
- 達成有效投注金額。
- 返佣層級。
- 返佣金額。

手機 card：

- 顯示幣種、結算時間、活躍會員人數與層級。
- 展開後顯示有效投注金額與返佣金額。

## Shared Composable

新增 shared composable，例如：

- `libs/shared/ui-layer/src/lib/composables/useAgentCollaborationFlow.ts`

職責：

- 查詢 visibility。
- 初始化可用幣別。
- 推導目前 selected currency。
- 查詢 statistics。
- 管理目前 tab。
- 管理邀請明細 filter、pagination 與資料 mapping。
- 管理返佣明細 filter、pagination 與資料 mapping。
- 統一 loading、empty、error state。
- 提供 copy referral code action。

輸入：

- `pageSize?: number`，預設 `10`。
- `defaultRoutePath?: string`，預設 `/collaboration`。
- `enableVisibility?: boolean`，預設 `true`。

輸出：

- `isVisible`。
- `visibilityPending`。
- `selectedCurrencyId`。
- `currencyOptions`。
- `statistics`。
- `activeTab`。
- `invitationState`。
- `rebateState`。
- `copyReferralCode`。
- `searchInvitations`。
- `searchRebates`。
- `changeCurrency`。
- `changeTab`。

## Shared Components

優先在 shared 實作可復用頁面元件，r017 只負責 route、layout wrapper 與少量版型 styling。

建議新增：

- `libs/shared/ui-layer/src/lib/components/AgentCollaborationPage.vue`
- `libs/shared/ui-layer/src/lib/components/AgentCollaborationStats.vue`
- `libs/shared/ui-layer/src/lib/components/AgentCollaborationInvitationList.vue`
- `libs/shared/ui-layer/src/lib/components/AgentCollaborationRebateList.vue`

元件原則：

- 使用既有 Base components，例如 `BaseSelect`、`BaseImage`。
- 使用既有 i18n key，缺少才新增 shared key。
- 使用既有 CSS variables，避免 hardcoded hex/rgb/rgba。
- 版型差異透過 CSS variables 或 `classObj` 控制，不複製整套 DOM。
- r017 page 不額外堆大量 scoped CSS，除非只是版型容器或背景。

## r017 Wiring

新增：

- `apps/r017/src/pages/collaboration.vue`

調整：

- `libs/shared/ui-layer/src/lib/constants/routePath.ts` 新增 `ROUTE_PATH.COLLABORATION = "/collaboration"`。
- `apps/r017/src/composables/useSideMenu.ts` 新增合營代理入口 mapping。

側欄入口策略：

- 若 CMS menu 有合營代理入口，優先使用 CMS entry。
- 若 CMS menu 沒有，但 visibility truthy，補一個靜態入口。
- 避免用多語 label 重複硬寫同一組 icon；應使用 normalize 後的 menu key 或 route mapping。

## 文案策略

優先使用既有 i18n key：

- `menu.collaboration`
- `table_header.member_account`
- `table_header.deposit_count`
- `table_header.collab_rebate_amount`
- `table_header.active_member_accounts`
- `table_header.subordinate_valid_bet`
- `query_params.member_account`
- `query_params.state`
- `common.search`

缺少時再新增 shared i18n key。

不在 r017 local component 硬寫大量文案，除非該文案只屬於 r017。

## 圖片策略

- banner 由 statistics API 回傳。
- 相對路徑透過 shared `BaseImage.vue` 解析。
- image base 以 `NUXT_PUBLIC_IMAGE_BASE` 對應的 runtime config 為準。
- 若 API 無 banner，顯示設計稿要求的空狀態或 fallback 區塊。

## 狀態與錯誤處理

- visibility loading：顯示頁面 loading 狀態。
- visibility false：顯示空狀態。
- statistics empty：保留頁面結構，統計卡片顯示 `-` 或空狀態。
- invitation/rebate empty：顯示 empty state，不隱藏整個 panel。
- API error：顯示錯誤狀態或 toast，避免使用假資料。
- copy referral code 成功：顯示成功提示。
- copy 失敗：顯示失敗提示或靜默 fallback。

## 驗收標準

- `/collaboration` 可直接進入。
- visibility truthy 時，頁面顯示合營代理內容。
- visibility falsy 時，頁面顯示空狀態。
- 側欄入口受 visibility 控制。
- 幣別切換會重新載入 statistics 與目前 tab 明細。
- 邀請明細可依會員帳號與狀態搜尋。
- 返佣明細可依日期搜尋。
- 桌面版符合 PC 設計稿主要比例。
- 平板版符合 1439px ~ 1000px 與 992px 設計稿主要比例。
- 手機版寬度符合 viewport，不橫向溢出。
- 手機版列表使用 card layout。
- 分頁在 total 超過 page size 時可切換。
- 不使用 mock data。
- 不接 domains API。

## 建議驗證

實作後建議執行：

- Focused lint 或 type check，依專案可用指令確認。
- `git --no-pager diff --check`。
- Browser QA：
  - `/collaboration` PC viewport。
  - `/collaboration` 992px viewport。
  - `/collaboration` 375px mobile viewport。
  - visibility false 狀態。
  - empty list 狀態。
  - invitation/rebate 分頁狀態。

