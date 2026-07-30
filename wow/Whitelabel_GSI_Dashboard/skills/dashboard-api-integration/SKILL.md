---
name: dashboard-api-integration
description: 使用者要求新增 brand new API、API integration、新增 API wrapper、endpoint、request/response contract，或替 Dashboard 串接全新後端 API 時使用。
---

# Dashboard API Integration

此 skill 只用於 brand-new API integration。不要用於既有 API usage 修改、UI-only work，或單純調整 caller behavior。Repo-wide API contract rules 以 root `AGENTS.md` 為準。

## 編輯前

- 如果缺少資訊，先詢問 backend spec：endpoint、HTTP method、normal / platform / platform-job path behavior、request params 或 body、response payload、target API module、first caller 或 page，以及是否需要 enum/constants。
- 實作前，先說明本次 API integration 的 touched surfaces：目標 `src/api/*` module、request/response type entries、first caller，以及必要時的 enum constants。

## 探索

- 檢查最接近的 sibling API module，確認 wrapper naming、method import、payload mapping 與 request options pattern。
- 檢查 `src/utils/request.ts`，確認本次 endpoint 的 request mode。
- 檢查相近 contracts 的命名與放置區塊，讓新增 types 放在同一 API family 附近。
- 只有在 backend spec 明確提供 enum-like values 時，才檢查 constants placement。

## 實作

- 只新增使用者要求的 endpoint wrappers；不要順手改既有 API usage。
- 優先放進最符合 domain 的 existing API module；只有沒有合適 module 時才建立新 module。
- 依照 root `AGENTS.md` 套用 API contract、wrapper generic、platform endpoint 與 constants 規則，不在此重複。
