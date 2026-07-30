# Claim Gift Success Toast Design

## 背景

`ClaimGift` 目前領取成功後會刷新禮物與錢包資料，然後進入下一筆或關閉彈窗。使用者希望領取成功後，右上角額外顯示一個共用模組的綠色提示。

## 範圍

本次只處理 `ClaimGift` 領取成功提示：

- API 或 mock claim 成功後顯示右上角 success toast。
- Toast 使用既有共用提示機制，不新增新的提示 UI。
- Toast 文案使用 i18n key，不硬碼、不補本地 locale。

不做：

- 不改 claim gift overlay 視覺。
- 不改 PrimeVue Toast 全域設定。
- 不新增或修改本地 locale JSON。
- 不改 API contract。

## 既有模組

- r017 已在 `apps/r017/src/app.vue` 掛載 `<Toast position="top-right" />`。
- r017 透過 `apps/r017/src/components/ToastQueueBridge.client.vue` 與 `apps/r017/src/composables/useToastQueue.ts` 將 queue 訊息送進 PrimeVue Toast。
- shared API error flow 已透過 `nuxtApp.$appToast` 呼叫同一套提示機制。

## 設計

在 `libs/shared/ui-layer/src/lib/composables/useClaimGiftFlow.ts` 內沿用 shared 可用的 Nuxt app injection：

- 成功條件：`confirmSuccess()` 中 claim 成功，且 `response.status === true`。
- 成功文案：`t("common.alarm.successfullyClaimed")`。
- Toast 類型：`TOAST_SEVERITY_ENUMS.SUCCESS`。
- 預設生命週期：`2200ms`。
- 插入點：`refreshAfterClaim()` 完成後、`finishClaim()` 執行前。

Mock claim 成功也應顯示同樣提示，確保 dev/mock 模式行為一致。

## i18n

使用遠端 locale key：

- `common.alarm.successfullyClaimed`

已確認使用者提供的遠端 `zh-TW` 與 `en` locale 都包含此 key。

## 驗收

- 領取成功後右上角顯示 green success toast。
- Toast detail 為 `t("common.alarm.successfullyClaimed")`。
- 不新增本地 locale key。
- 不新增硬碼成功文案。
