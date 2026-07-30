---
name: multiverse-nx-feature-screen-flow
description: 在 whitelabel-gsi-platform-multiverse-nx 中，當使用者指定功能並提供斷點設計稿、互動狀態、API 或 mock 資訊，要求建構版型 app 功能畫面、單頁或多頁小流程時使用。
---

# Multiverse Nx Feature Screen Flow

此 skill 用於依功能需求建構版型 app 的完整畫面與資料流。本 skill 以「版型 app（template app）」稱呼 `apps/<tenant>` 下的白標前台 app。

## 使用時機

- 使用者指定一個功能，例如 login、register、forgot password、reset password、會員功能或活動功能。
- 需要依斷點設計稿完成 desktop / tablet / mobile 畫面。
- 需要依 API 或 mock 資訊建立資料流、表單送出、錯誤處理或成功狀態。
- 需要判斷功能是單一 page、multi-step page，還是多 route 小流程。
- 需要先檢查是否已有共用 page、component、composable、store、constants 或 API hook。

## 不使用時機

- 只是單純新增 API wrapper，改用 `skills/multiverse-nx-shared-api/SKILL.md`。
- 只是修改 Base component、theme token、PrimeVue preset，改用 `skills/multiverse-nx-design-system/SKILL.md`。
- 只是調整既有 route/page 局部行為，改用 `skills/multiverse-nx-tenant-page-flow/SKILL.md`。
- 是 auth domain 深度修改，例如 token、redirect、middleware 或 OAuth，需搭配或改用 `skills/multiverse-nx-auth-flow/SKILL.md`。
- 是會員中心專用 summary、history、bank card、orders 等流程，需搭配或改用 `skills/multiverse-nx-member-center-flow/SKILL.md`。

## RD 必須提供

- 功能名稱與目標版型 app（template app），例如 login、register、forgot password、`apps/r017`。
- 斷點設計稿：
  - desktop / tablet / mobile 的畫面或連結。
  - 每個斷點的版面差異、顯示/隱藏規則與互動狀態。
  - loading、empty、error、disabled、success 等狀態稿；若未提供，需明確標記。
- API 或 mock 資訊：
  - endpoint、method、request params/body、response shape。
  - 欄位 nullable、錯誤碼、成功/失敗情境。
  - 是否已有 API wrapper/hook，或需要新增 shared API。
  - 若暫時使用 mock，需提供 mock data shape 與替換真 API 的 boundary。
- Route/page 期望：
  - 目標 path、是否多頁/多步驟、是否需要 auth/guest middleware。
- 驗收標準：
  - 必須支援的 breakpoint、互動流程、API/mock 行為與人工驗收重點。

## 工作流程

- 先確認 RD 已提供功能名稱、目標版型 app、斷點設計稿、API/mock contract、route/page 期望與驗收標準；缺少關鍵資訊時先列出缺口，不自行猜測。
- 判斷功能是單頁、multi-step page，還是多 route 小流程，並列出會新增或調整的 page path。
- 先檢查 shared layer 與版型 app 的既有資源：
  - shared page 或 page pattern。
  - shared Base component 或 feature component。
  - shared composable。
  - shared store / constants。
  - shared API wrapper / hook。
  - 版型 app 內相近的 sibling page、component、composable。
- 採 shared-first 決策：
  - 新增可跨功能、跨版型 app、跨頁面復用的 page、component、composable、store、constants 或 API hook 時，統一先放 `libs/shared/ui-layer`。
  - 只有明確屬於單一版型 app、單一功能限定，或設計稿高度客製的部分，才放 `apps/<tenant>`。
  - 不確定是否該 shared 時，先列出判斷理由，並偏向 shared。
  - 不為了趕功能複製既有 shared 邏輯到版型 app local。
- 依設計稿建構畫面，覆蓋 desktop / tablet / mobile，以及 loading、empty、error、disabled、success 等狀態；未提供的狀態需列為未提供，不自行發明複雜流程。
- 顏色與 theme token 處理：
  - 不直接把設計稿的 hex / rgb / rgba 寫死在 shared component 或 page flow。
  - 先查 `apps/<tenant>/src/assets/styles/_variables*.scss`、`libs/shared/ui-layer/src/assets/styles/_primevue_variables.scss`、既有 Base component 使用的 `var(--...)`。
  - 優先使用既有 CSS variables / semantic tokens 替換指定顏色；若只能找到近似色，需在回報中說明「近似替換，非 1:1」。
  - 若設計要求 1:1 且沒有合適既有變數，先停下回報，建議新增語意 token，例如 `--announcement-panel-bg`，不要直接新增硬編碼色。
  - 版型 app 專屬背景、漸層或深淺模式可放在 tenant page 的 `classObj` / theme config，但仍應優先用 `var(--...)`。
- 依 API/mock 建構資料流：
  - API 已存在時，優先接既有 hook。
  - API 尚未存在但 RD 提供 contract 時，搭配 `skills/multiverse-nx-shared-api/SKILL.md` 新增 wrapper/hook。
  - 只有 mock 時，建立清楚 mock boundary，避免資料 mapping 散落在 template。
- 完成後回報功能名稱、目標版型 app、routes/pages、shared/版型 app files、API/mock、breakpoint coverage、已驗證與未驗證項目。

## 常見錯誤

- 直接開新版型 app component，沒有先找 shared component。
- 把可共用 composable、constants 或 API hook 放進版型 app local。
- 複製既有 page flow，而不是抽共用或復用。
- 沒有處理 mobile breakpoint、loading、empty、error state。
- API/mock data mapping 散落在 Vue template。
- 把 auth/member 專用流程混進一般 page flow，沒有搭配對應 skill。
- 直接把設計稿色碼寫進 shared 元件，沒有先找既有 theme variables。
- 用近似變數替換顏色但沒有回報視覺可能非 1:1。

## 輸出補充

回覆需列出：

- 功能名稱與目標版型 app。
- 建立或調整的 route/page。
- 復用哪些 shared 資源。
- 新增哪些 shared 資源。
- 新增哪些版型 app local 資源與原因。
- API/mock 使用方式。
- 覆蓋哪些 breakpoint 與狀態。
- 已執行與未執行的驗證。

## 完成與驗收

- 已檢查 shared 與版型 app 既有資源。
- 可共用邏輯優先放 shared layer。
- 版型 app local 新增有明確理由。
- 設計稿指定斷點都有對應實作。
- API/mock boundary 清楚。
- loading、empty、error、disabled、success state 有處理或明確列為未提供。
