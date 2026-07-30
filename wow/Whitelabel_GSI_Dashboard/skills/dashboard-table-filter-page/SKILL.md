---
name: dashboard-table-filter-page
description: 使用者要求新增或修改 Dashboard list、table、search、filter、pagination、sorting、export，或 table CRUD page 行為時使用。
---

# Dashboard Table Filter Page

此 skill 只用於列表、表格、搜尋篩選、分頁、排序、匯出與 table CRUD page workflow。不要用於純 route 建立或與 table/list 無關的 UI 修改。Repo-wide API 與 validation rules 以 root `AGENTS.md` 為準。

## 編輯前

- 如果缺少資訊，先詢問目標 page/module、資料來源 API、filter fields、table columns、pagination behavior、sorting behavior、是否需要 export，以及 add/edit/detail 是否在 scope 內。
- 實作前，先說明本次 table/filter workflow 的 touched surfaces：目標 `src/pages/<module>`、相關 API caller、table/query components，以及明確需要的 contract entries。

## 探索

- 檢查同 module 或 sibling page 中最接近的 list/table page，鏡像其 query state、API params mapping、table columns、pagination 與 loading pattern。
- 檢查 `src/hook/useSearch.ts`、`src/hook/useTable.ts`、`src/hook/useTableSort.ts`、`src/hook/useExport.ts` 是否已有可沿用行為。
- 檢查 `src/components/query/*`、`src/components/tables/*` 與 `src/components/paginations/*` 是否已有符合需求的 shared components。
- 如果涉及 API payload，只確認 caller 與 params mapping；API contract policy 交由 root `AGENTS.md`。

## 實作

- 保持 filter state、route query、API params mapping、pagination offset/size 的命名與 sibling page 一致。
- 排序變更要確認 `order_type`、`sort_type` 是否符合既有 backend contract。
- Export 行為要沿用既有 export hook 或 sibling page pattern；不要重新發明 download flow。
- Table columns、row actions、permission-gated buttons 要只影響指定 page 或指定 shared component。
