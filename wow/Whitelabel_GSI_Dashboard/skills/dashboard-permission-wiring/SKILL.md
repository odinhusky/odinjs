---
name: dashboard-permission-wiring
description: 使用者要求新增、修改、檢查 Dashboard route permission、menu permission、permission id、edit/export/view，或 feature-level permission controls 時使用。
---

# Dashboard 權限串接

此 skill 只用於權限串接或權限行為調整。不要用於一般 route 建立、UI-only 修改，或沒有權限變更的功能開發。Repo-wide 權限邊界以 root `AGENTS.md` 為準。

## 編輯前

- 如果缺少資訊，先詢問權限目標是 route entry、menu visibility、feature-level controls，或 `edit/export/view` action。
- 如果缺少資訊，先詢問 permission id、對應 audience、parent menu/module、是否要改變 page entry behavior，以及受影響的 feature controls。
- 實作前，先說明本次 permission wiring 的 touched surfaces：route record、permission constants、permission hook usage，或 feature-local usage point。

## 探索

- 檢查最接近的 route branch，確認 `meta.permission`、`menuShow`、breadcrumb 與 group pattern。
- 檢查相鄰 permission id 的命名與 numbering pattern。
- 如果是 `edit/export/view` action，確認既有 action flag 的讀取方式。
- 如果是 feature-level controls，先找該 page/component 的 local permission usage point。

## 實作

- 只改使用者指定的 permission target。
- 只有在使用者提供 permission id，或權限樹/route/menu entry 明確需要時，才新增 permission constants。
- 如果同一需求同時涉及 route/menu 與 feature control，分別列出對應使用點後再改。
