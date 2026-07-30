---
name: multiverse-nx-shared-api
description: 在 whitelabel-gsi-platform-multiverse-nx 中，當使用者要求新增 brand-new API integration、API wrapper、endpoint path、common type、request/response type、TanStack Query key、useApiQuery/useApiMutation hook，或替 shared ui-layer 串接全新後端 API 時使用。若只是既有 API caller 行為、UI-only work 或 tenant page layout 修改，請勿使用。
---

# Multiverse Nx Shared API

此 skill 只用於 `libs/shared/ui-layer` 的 brand-new API 串接。既有 API bug fix 先讀相鄰 wrapper，但不要自動擴大成新 API 整理。

## 必要資訊

- Endpoint path 與 domain，例如 auth、bank、game、userInfo、report、vip。
- HTTP method、query/body/path params、response payload、nullable behavior。
- 是否需要 token、`usePlatform`、`directCallAWS` 或 form-data。
- 是否需要 query key 與 TanStack Query hook；若只有 raw wrapper，不要多建 hook。
- 第一個 consumer 是 shared layer、tenant page，或尚未接 caller。

## 先讀的檔案

- `libs/shared/ui-layer/src/lib/api/endpointPaths/index.ts`
- `libs/shared/ui-layer/src/lib/api/apiFunctions/<domain>_<action>.ts`
- `libs/shared/ui-layer/src/lib/api/commonTypes/<domain>Types.ts`
- `libs/shared/ui-layer/src/lib/api/hooks/use*.ts`
- `libs/shared/ui-layer/src/lib/constants/tanstackQueryKeys/*`
- `libs/shared/ui-layer/src/lib/api/axiosInterceptors.ts`、`useApiQuery.ts`、`useApiMutation.ts`

## 流程

- 優先新增一個 endpoint 一個 wrapper 檔，命名維持 `<domain>_<action>.ts`。
- Endpoint path 先加到 `ENDPOINT_PATHS` 的對應 domain；path params 用函式產生，不要重複塞進 payload。
- Request / response 型別放在 wrapper 檔或對應 `commonTypes`；多個 API 共用的 shape 才放 common type。
- Wrapper 使用 `requestFn<RequestType, ResponseType>(ENDPOINT_PATHS.X.Y, params, config)`，依 method 讓 interceptor 決定 `params` 或 `data`。
- TanStack Query hook 只有 consumer 需要快取、loading 或 refetch behavior 時才新增，並搭配 focused query key。
- 實作後回報 wrapper name、endpoint path、types、query key/hook，以及第一個 consuming file。
