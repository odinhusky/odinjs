---
name: multiverse-nx-tenant-page-flow
description: 在 whitelabel-gsi-platform-multiverse-nx 中，當使用者要求新增或調整 tenant Nuxt page、file-based route、member route、layout、middleware auth route group、page-level composable flow，或 apps/<tenant>/src/pages 下的頁面行為時使用。若任務主要是 shared API、會員中心專用功能、auth flow 或 design-system 元件，請改用對應 skill。
---

# Multiverse Nx Tenant Page Flow

此 skill 用於 tenant app 的 Nuxt page 與 route-level 行為。不要把 page task 自動升級成 shared layer refactor。

## 必要資訊

- 目標 tenant，例如 `apps/r017`。
- Page path，例如 `src/pages/member/summary.vue`、dynamic route 或 nested route。
- 是否需要 layout、middleware、auth required / guest only behavior。
- 是否需要 app-local components、composables、constants、stores 或 plugins。
- 是否需要 shared API hook；若需要，只在確認 API 已存在或使用者要求新增 API 時搭配 shared API skill。

## 先讀的檔案

- `apps/<tenant>/src/pages/**`
- `apps/<tenant>/src/layouts/**`
- `apps/<tenant>/src/middleware/**`
- `apps/<tenant>/src/components/**`
- `apps/<tenant>/src/composables/**`
- `apps/<tenant>/src/constants/**`
- `libs/shared/ui-layer/src/lib/constants/routePath.ts`

## 流程

- 先找最接近的 sibling page，鏡像它的 component split、composable shape、route query、loading/empty state 與 mobile behavior。
- Nuxt file-based route 以 file path 為準；只有 shared route constants 或 auth route group 需要同步時才改 `routePath.ts`。
- Page-specific state 放 tenant composable；跨頁共用才放 tenant store；跨 tenant 共用才考慮 shared layer。
- 若新增 dynamic route，檢查 middleware prefix handling 與 `toXRoute()` helper。
- 實作後回報 page path、route path、auth group 是否改變，以及新增的 app-local supporting files。
