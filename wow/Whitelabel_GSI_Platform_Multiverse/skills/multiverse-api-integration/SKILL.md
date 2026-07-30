---
name: multiverse-api-integration
description: 在 Whitelabel_GSI_Platform_Multiverse 中，當使用者要求 brand-new API integration、新增 API、串接 API、新增 endpoint、新 endpoint、new service call、endpoint wrapper、request type 或 response type 時使用。若只是 UI-only change、existing API bug fix 或 response field rename，請勿使用。
---

# Multiverse API 串接

當任務需要新增 brand-new API endpoint wrapper 或第一次串接新的 service call 時，從 `Whitelabel_GSI_Platform_Multiverse` 的 repository root 使用此 skill。

## 必要規格

規劃或編輯前，先確認任何缺少的 API contract：

- Endpoint path，例如 `/v1/player/...` 或 `/platform/v1/player/...`。
- HTTP method，例如 `get`、`post`、`put`、`delete`。
- Request shape：query params、body payload、path params，或明確 `null`。
- Response shape：成功 payload、nullable behavior、list/pagination wrapper，或明確 `null`。
- Auth/token behavior：default token、`needToken: false`，或特殊 headers/config。
- Target scope：shared API only、特定 feature、特定 template/siteKey，或 consuming page/composable。
- 是否需要 full `ApiResponse`；只有 consumer 需要 status/code/msg/excode 時才使用 full response wrapper。

## 流程

- 先檢查最接近的 `src/api/<domain>.ts` 與同 domain 的既有 wrapper naming、`name` config、method style。
- 若 domain file 已存在，將 wrapper 加到該檔；只有沒有合理 domain file 時才新增 `src/api/<domain>.ts`。
- 在 `src/api/request.type.ts` 新增 request interface；沒有 params 時 wrapper 使用 `null`。
- 在 `src/api/response.type.ts` 新增 response interface/type；沒有 payload 時 wrapper response 使用 `null`。
- 使用 `requestApi<Request.Xxx, Response.Xxx>(endpoint, params, { name, method })`。只有需要完整 response envelope 時才使用 `requestApiFullResponse`。
- GET query 使用 params；POST/PUT/DELETE payload 使用 data。Path params 應進入 endpoint string，不要重複放入 payload，除非 backend contract 明確要求。
- 只有使用者要求接到畫面、hook 或 composable 時，才修改 consuming code。
- 實作後，回報新增的 API wrapper name、endpoint、request/response types，以及任何 consuming files。
