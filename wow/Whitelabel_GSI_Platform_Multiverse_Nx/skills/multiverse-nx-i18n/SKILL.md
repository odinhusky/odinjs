---
name: multiverse-nx-i18n
description: Use when checking or fixing i18n usage in whitelabel-gsi-platform-multiverse-nx, including UI copy, placeholders, empty/loading/status text, button labels, tabs, form labels, alt text, aria-labels, remote locale key alignment, hardcoded text removal, and local locale hygiene.
---

# Multiverse Nx i18n

此 skill 用於檢查或修正前台多國語文字使用方式，尤其是使用者提供遠端 locale JSON 並要求「統一都用 key、不要硬碼、不要補本地」時。

## 使用時機

- 檢查某個 feature、page、component、composable 或 constants 是否都有套用多國語。
- 修正 UI 可見文字、placeholder、empty/loading/status 文案、按鈕文字、tab/label、`alt`、`aria-label`。
- 使用者提供遠端翻譯檔，例如 `https://locale.templates.gsiwl.com/locale/frontend/zh-TW.json` 與 `https://locale.templates.gsiwl.com/locale/frontend/en.json`。
- 移除 component、composable 或 constants 內的中英文硬碼、fallback map、locale 判斷 fallback 或 dev 假文案。
- 確認本地 `libs/shared/ui-layer/i18n/locales/*.json` 或 tenant local locale 檔是否被誤改。

## 不使用時機

- 只調整顏色、版面、spacing、theme token 或 Base component 視覺樣式；改用 `skills/multiverse-nx-design-system/SKILL.md`。
- 只新增 API wrapper、endpoint、type 或 TanStack Query hook；改用 `skills/multiverse-nx-shared-api/SKILL.md`。
- 需要新增翻譯 key 或修改翻譯內容；先回報缺口並等 RD 授權，不直接實作。
- 涉及遠端翻譯平台寫入、上傳、同步或發布；預設只讀取與分析。

## 工作流程

- 先用 targeted `rg` 找出目標 domain 的 page、component、composable、constants 與既有 i18n key 使用。
- 若使用者提供遠端 locale JSON，先讀取或下載到 `/private/tmp` 做 key 比對；下載需要網路授權時，依 `AGENTS.md` 先取得授權。
- 以遠端 locale key 為準，優先改程式使用 `t("key")` 或既有專案 i18n pattern。
- 不要用 `te(key) ? t(key) : "硬碼文案"`、`locale.value` 判斷 fallback、中文 fallback map、英文 fallback map 或 dev 假文案來補缺字。
- 不要因缺 key 而自行新增或修改 `libs/shared/ui-layer/i18n/locales/*.json`、tenant local locale 檔或其他本地翻譯檔。
- 若遠端 key 存在但本地 locale 檔缺少該 key，仍依需求改程式使用遠端 key，不補本地。
- 若找不到遠端 key，先回報缺 key 與建議 key 名稱，等待 RD 決定是否新增翻譯。
- 對 API 回傳的多語內容，優先用目前語系對應資料；需要 fallback 時只能 fallback 到 API 既有資料，不寫死顯示文案。

## 常見錯誤

- 把 UI 文案直接寫成中文或英文。
- 用 `te` 或 `locale` 判斷後 fallback 到硬碼文字。
- 在 constants 裡建立中文 label map。
- 為了讓本地立即顯示而補 `libs/shared/ui-layer/i18n/locales/*.json`。
- 改了文案 key，卻沒有確認遠端 `zh-TW` 與 `en` 都存在。
- 只掃 template，漏掉 composable、constants、`alt` 或 `aria-label`。

## 輸出補充

回覆需列出：

- 檢查或修改的 domain / feature。
- 使用的遠端 locale 檔。
- 改用的主要 i18n key。
- 是否有缺 key、硬碼殘留或無法判斷的文案。
- 是否有修改本地 locale 檔；預期應為未修改，除非 RD 明確授權。

## 完成與驗收

- 目標範圍內可見文案、placeholder、狀態文案、按鈕、tab/label、`alt`、`aria-label` 不再使用硬碼顯示文字。
- 使用到的 key 已確認存在於使用者指定的遠端語系檔。
- 沒有新增或修改本地 locale 檔，除非 RD 明確授權。
- 已執行 `git diff --check -- <touched files>`。
- 已用 `rg` 針對目標 domain 掃描硬碼、fallback helper 與舊 key 殘留。
