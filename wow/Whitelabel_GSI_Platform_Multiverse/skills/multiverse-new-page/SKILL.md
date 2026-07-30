---
name: multiverse-new-page
description: 在 Whitelabel_GSI_Platform_Multiverse 中，當使用者要求 brand-new page/route/screen/view、建立新頁面、新增頁面、新增 route 或註冊新頁面時使用。若是從既有 template clone UI/behavior、調整既有頁面樣式，請勿使用。
---

# Multiverse 新增頁面

當任務會新增 page 或 route 時，從 `Whitelabel_GSI_Platform_Multiverse` 的 repository root 使用此 skill。

## 必要規格

規劃或編輯新頁面前，先確認任何缺少的規格：

- 目標 template/siteKey，或明確的 shared route scope。
- 頁面位置：top-level route、member route、modal entry、CMS/menu entry，或其他既有區段。
- Route path 與 route name。
- Route meta/auth 行為，例如 `needAuth`、`goRouteIfNoToken`、`className` 或 layout flags。
- 當 backend-driven navigation 必須開啟此頁時，需要 menu/CMS/DID number。
- 若頁面需要新的 data access，確認 API/data needs。
- Visible label key 或精確 copy。

## 流程

- 檢查目標 template route file 與最接近的 sibling page folder，以沿用 local structure。
- 使用目標 template 既有的 `pages` convention 新增 page files，通常是 `template/<siteKey>/pages/<PageName>/Index.vue`。
- 使用既有 nesting、alias 與 meta style，在目標 template route file 註冊 route。
- 只有 requested navigation path 需要時，才更新 menu 或 CMS mapping files。
- 實作後，回報 route path/name 以及任何被修改的 navigation mapping files。
