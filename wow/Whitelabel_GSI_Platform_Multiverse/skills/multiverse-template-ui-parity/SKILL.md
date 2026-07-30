---
name: multiverse-template-ui-parity
description: 在 Whitelabel_GSI_Platform_Multiverse 中，當使用者要求 clone/copy/mirror/port/match existing template UI/behavior 到另一個 template，或說「從 A template 搬到 B template」「照某 template 做一樣」時使用。若是 brand-new page creation，請勿使用。
---

# Multiverse Template UI Parity

當任務目標是讓某個 template 的畫面或互動行為對齊另一個已存在的 template/route/component 時，從 repository root 使用此 skill。

## 必要規格

規劃或編輯前，先確認任何缺少的 parity scope：

- Source template/siteKey 與 source route/component/file。
- Target template/siteKey；若使用者說 all template，列出會被檢查的 template family。
- Target surface：page、dialog、form、header/footer、menu、popup、CMS page，或 specific component。
- 是否只要 visual parity，或也要 behavior/data flow parity。
- Desktop/mobile、hover/active/disabled/loading/error/empty states 是否都要比對。
- Source 是否包含 assets、template-local SCSS/Sass、CSS variables、`:deep(...)` selectors、helpers、hooks 或 events。

## 流程

- 先讀 source 與 target 的對應檔案，再決定要 copy 哪些 markup、script、style 或 assets。
- 若 target 有 sibling variants，先找同 family pattern；例如 `set33_GREEN`/`set33_RED`、`okbet_*`、`set_r024`/`set_r025`。
- 優先做 template-local 修改：`template/<siteKey>/pages`、`components`、`assets/css`、`hooks` 或 `utils`。
- 只有使用者明確要求 shared behavior，或證明所有 target 都走同一 shared path 時，才修改 `src/common`。
- Visual parity 不能只比 markup；必須比對 local style block、imported template CSS、font、spacing、hover、active、disabled 與 mobile overrides。
- Behavior parity 需要比對事件、computed state、watchers、route/query、store/composable calls 與 loading/error handling。
- 若 source 使用 assets，確認 target 是否已有對應資源；不要用其他 brand asset 取代，除非使用者明確要求。
- 實作後，回報 source reference、target files、是否有 shared files，以及仍需人工看的 visual states。

## 常見陷阱

- 只 copy markup，卻漏掉 `.bg-quick`、`.quickBtns`、`:deep(...)` 或 template-local font/color rules。
- 從 brand variables 推測設計，而不是直接 mirror 使用者指定的 reference component。
- 把一個 tenant 的 parity request 改成 shared abstraction，導致其他 templates 被意外影響。
- 只看 desktop，漏掉 mobile popup、drawer、pagination、overflow 或 active state。
