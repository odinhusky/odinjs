# Announcement Center Overlay Design

## 背景

本需求要依設計稿實作會員端公告中心。公告中心不是獨立路由頁，也不是導頁流程；它會在使用者進入任一頁面後，根據公告 API 是否有資料，自動覆蓋在目前頁面上。

關閉公告中心只關閉 overlay，不改 route、不返回上一頁，也不影響底下頁面的狀態。

API 規範參考：

- `/Users/aiden.chen/jStar/Whitelabel_GSI_Platform_Multiverse/announcement-api-structure.md`

## 範圍

本次只實作公告中心 overlay：

- 進入頁面後自動查詢公告 API。
- API 有 `ALL_CONTENT` 公告且未設定「今日不再顯示」時，自動開啟公告中心。
- 支援公告類型、發佈時間、關鍵字搜尋與前端分頁。
- 支援 PC、平板與手機版設計稿斷點。
- 支援公告文字與公告圖片。
- 支援「今日不再顯示」，整個公告中心當天不再自動彈出。

不做：

- 不新增 `/announcement` route。
- 不做 route-driven dialog。
- 不做圖片公告彈窗。
- 不做跑馬燈。
- 不做 HTML content rendering。
- 不做 sanitize / HTML 白名單。
- 不做單筆公告已讀或單筆不再顯示。

## 斷點與版型

依設計稿分為三段：

- `1440px` 以上：PC。
- `769px ~ 1439px`：平板。
- `768px` 以下：手機。

PC 與平板使用左右欄：

- 左側為公告列表與分頁。
- 右側為公告詳情。
- 上方為篩選列。
- 底部顯示「今日不再顯示」。

手機使用單欄：

- 上方為篩選表單。
- 下方為公告列表。
- 點選公告後，在列表區展開該公告詳情。
- 可收起回列表狀態。
- 底部顯示「今日不再顯示」。

## API Contract

修正 shared announcement API 型別與參數。

Endpoint：

```txt
GET /v1/player/announcement/list
```

Request query：

```ts
type GetAnnouncementListParams = {
  start_time_from?: string
  start_time_to?: string
  keyword?: string
  offset?: number
  size?: number
}
```

處理規則：

- 日期格式使用 `YYYY-MM-DD`。
- `keyword` 送出前 `trim()`，空字串轉成 `undefined`。
- `offset` 最小值為 `0`。
- `size` 限制在 `0 ~ 100`。

Response 同時支援新舊格式：

```ts
type AnnouncementListResponse =
  | {
      list: Announcement[]
      pagination: {
        offset: number
        size: number
        total: number
      }
    }
  | Announcement[]
```

Shared 會 normalize 成：

```ts
type NormalizedAnnouncementListResponse = {
  list: Announcement[]
  pagination: {
    offset: number
    size: number
    total: number
  }
}
```

修正 `display_options` 型別：

```ts
display_options: ANNOUNCEMENT_DISPLAY_TYPE_ENUMS[]
```

## Data Model

公告資料沿用 API 規格：

```ts
type Announcement = {
  id: number
  type: ANNOUNCEMENT_MEMBER_TYPE_ENUMS
  start_time: string
  end_time: string
  detail: Record<string, AnnouncementDetail>
  display_options: ANNOUNCEMENT_DISPLAY_TYPE_ENUMS[]
  langDetail?: AnnouncementDetail
}

type AnnouncementDetail = {
  title: string
  content: string
  image_path: string
}
```

語系處理：

- 依目前 i18n locale 取 `detail[currentLang]`。
- 若目前語系沒有資料，使用空字串。
- 本次不額外做 fallback 語系策略。

內容顯示：

- `title` 顯示為純文字。
- `content` 顯示為純文字。
- `image_path` 顯示為圖片。
- 不使用 `v-html`。

## 圖片策略

公告圖片統一使用 shared `BaseImage.vue`：

- `AnnouncementDialog` 不直接使用原生 `<img>`。
- `AnnouncementDialog` 不自行實作 image URL builder。
- 圖片來源為 `announcement.langDetail.image_path`。
- 相對路徑由 `BaseImage` 透過 `runtimeConfig.public.imageBase` 組成完整 URL。
- `runtimeConfig.public.imageBase` 以 `NUXT_PUBLIC_IMAGE_BASE` 為準。
- 不導入 `VITE_APP_DYNAMIC_RESOURCE_URL`。
- 圖片載入失敗時沿用 `BaseImage` 既有 fallback 行為。

## Shared Composable

新增 `libs/shared/ui-layer/src/lib/composables/useAnnouncementCenterFlow.ts`。

職責：

- 透過 announcement query hook 查詢公告列表。
- normalize 新舊 API response。
- 只保留 `display_options` 包含 `ANNOUNCEMENT_DISPLAY_TYPE_ENUMS.ALL_CONTENT` 的公告。
- 依目前語系建立 `langDetail`。
- 管理 dialog 開關狀態。
- 管理目前選取公告。
- 管理公告類型、日期區間、keyword 與分頁狀態。
- 管理「今日不再顯示」狀態。

自動開啟條件：

- API 成功回傳。
- 有至少一筆 `ALL_CONTENT` 公告。
- `dontShowUntilTs` 不大於目前時間。

關閉行為：

- 關閉只更新 local dialog state。
- 不改 route。
- 不觸發頁面 reload。
- 若使用者勾選「今日不再顯示」，寫入下一個本地午夜時間。

## Persist

使用 local storage 保存：

```ts
type AnnouncementCenterPersistState = {
  dontShowUntilTs: number | null
}
```

判斷：

```ts
const shouldSkipToday = dontShowUntilTs != null && dontShowUntilTs > Date.now()
```

勾選「今日不再顯示」後：

- 計算本地時間下一個午夜。
- 寫入 `dontShowUntilTs`。
- 當天再次進入任何頁面時不自動開啟公告中心。
- 隔天自動恢復可彈出。

## Shared Component

新增 `libs/shared/ui-layer/src/lib/components/AnnouncementDialog.vue`。

職責：

- 呈現公告中心 overlay。
- 接收 composable 狀態與操作事件。
- 使用 shared base components：
  - `BaseDialog`
  - `BaseSelect`
  - `BaseDatePicker`
  - `BaseInput`
  - `BaseBtn`
  - `BasePagination`
  - `BaseCheckBox`
  - `BaseImage`
- 依設計稿處理 PC、平板、手機響應式 layout。
- 手機版支援列表與詳情展開狀態。

建議 props：

```ts
type AnnouncementDialogProps = {
  visible: boolean
  announcements: NormalizedAnnouncement[]
  selectedAnnouncement?: NormalizedAnnouncement | null
  filters: AnnouncementCenterFilters
  pagination: AnnouncementCenterPagination
  dontShowToday: boolean
  isLoading?: boolean
  isFetching?: boolean
  classObj?: AnnouncementDialogClassObj
}
```

建議 emits：

```ts
type AnnouncementDialogEmits = {
  close: []
  search: []
  clearFilters: []
  selectAnnouncement: [id: number]
  updateFilter: [filters: Partial<AnnouncementCenterFilters>]
  updatePage: [page: number]
  updateDontShowToday: [value: boolean]
}
```

## r017 Wiring

r017 在 layout 或全域容器掛載公告中心入口。

建議新增 app-local wrapper：

- `apps/r017/src/components/announcement/AnnouncementCenterOverlay.vue`

職責：

- 呼叫 shared `useAnnouncementCenterFlow`。
- 提供 r017 所需 class/theme 覆蓋。
- render shared `AnnouncementDialog`。

接入點：

- `apps/r017/src/layouts/default.vue`

行為：

- 進入頁面後自動查詢。
- 有資料時開啟 overlay。
- 關閉時只關閉 overlay，不改 route。

## i18n

優先復用既有 i18n key。

可復用 key：

- `menu.announcement_center`
- `query_params.announcement_type`
- `announcement.active_message`
- `announcement.game_news`
- `announcement.feature_update`
- `announcement.website_announce`
- `common.btn.all`

缺少文案先使用 component 內建英文 fallback，不在本次批量補齊所有語系。

需要 fallback 的文案：

- Publish Time
- Keyword
- Search
- Today no longer display
- No announcements

## Error Handling

- API 失敗時不自動開啟 overlay。
- API 回傳空資料時不自動開啟 overlay。
- 所有公告都不包含 `ALL_CONTENT` 時不自動開啟 overlay。
- 圖片載入失敗時使用 `BaseImage` fallback。
- 目前語系缺少 detail 時，該公告仍可顯示，但 title/content/image 為空資料。
- 搜尋沒有結果時顯示空狀態。

## 測試與驗證

建議單元測試：

- normalize 新舊 API response。
- 修正 query params：keyword trim、offset/size clamp。
- 只保留 `ALL_CONTENT` 公告。
- 依 locale 建立 `langDetail`。
- `dontShowUntilTs` 判斷與下一個午夜計算。
- 關閉 dialog 不改 route。

建議手動或 browser QA：

- PC `1440px` 以上版型。
- 平板 `769px ~ 1439px` 版型。
- 手機 `768px` 以下版型。
- API 有資料時自動開啟。
- API 無資料時不開啟。
- 勾選「今日不再顯示」後當天不再彈出。
- 圖片使用 `NUXT_PUBLIC_IMAGE_BASE` 正確載入。

## 開放問題

- 實作時需確認 `default.vue` 是否為唯一需要掛載公告中心的 layout。
- 實作時需確認目前 locale key 是否與 API `detail` key 完全一致。
- 實作時需確認設計稿日期區間 picker 是否可直接用現有 `BaseDatePicker` range mode 達成。
