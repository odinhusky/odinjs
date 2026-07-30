---
name: dashboard-new-page
description: 使用者要求新增、建立、註冊或串接 Dashboard page、route、menu entry，或提到 new page、新增頁面時使用。
---

# Dashboard 新頁面

此 skill 只用於 page、route 或 menu creation。不要用於 existing page 內的一般 behavior changes。Repo-wide permission、API、i18n 與 validation rules 以 root `AGENTS.md` 為準。

## 編輯前

- 如果缺少資訊，先詢問 route number 或 permission id、parent module 或 menu、page location、route path 與 name、`menuShow` audience、breadcrumb label 或精確 remote i18n key，以及 expected page type。
- 實作前，先說明本次 page creation 的 touched surfaces：`src/router/routes.ts`、`src/pages/<module>`，以及使用者明確要求的 task-specific files。

## 探索

- 檢查 `src/router/routes.ts` 中最接近的 existing route branch。
- 檢查 `src/pages/<module>` 底下最接近的 sibling page folder，並鏡像其 naming、nesting、layout 與 page-file pattern。
- 選定放置位置後，檢查 route names、route import path、page file path 與 route meta shape。

## 實作

- 只註冊使用者要求的 page、route 或 menu entry。
- 只建立 page/route/menu entry 所需的最小檔案與 route records。
- Permission id、API files 或 constants 只有在 page creation scope 明確需要時才納入。
