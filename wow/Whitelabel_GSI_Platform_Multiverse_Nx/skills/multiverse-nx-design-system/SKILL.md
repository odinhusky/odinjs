---
name: multiverse-nx-design-system
description: 在 whitelabel-gsi-platform-multiverse-nx 中，當使用者要求新增或修改 Base components、shared UI layer component、PrimeVue preset、Tailwind preset、SCSS variables、theme token、fonts、shared styles、icon/image base component、table/select/button/dialog/date-picker/chart 等 design-system surface 時使用。若只是單一 tenant page 的局部排版，請先用 tenant page skill。
---

# Multiverse Nx Design System

此 skill 用於 shared UI layer 或 tenant theme token。Base components 會影響所有引用者，先確認 blast radius。

## 必要資訊

- 目標是 shared Base component、tenant-local theme、PrimeVue preset、Tailwind preset、SCSS variables、fonts，或 app-local style。
- 是否影響所有 tenants，或只影響 `apps/<tenant>`。
- 需要支援的 states：desktop/mobile、hover、active、disabled、loading、error、empty、dark mode。

## 先讀的檔案

- Shared components：`libs/shared/ui-layer/src/lib/components/Base*.vue`
- Shared styles：`libs/shared/ui-layer/src/assets/styles/_common.scss`、`_primevue_variables.scss`
- Shared preset：`libs/shared/ui-layer/src/lib/prime-presets/shared-aura.ts`
- Tenant theme：`apps/<tenant>/src/themes/*.ts`
- Tenant variables/styles：`apps/<tenant>/src/assets/styles/_variables*.scss`、`all.scss`
- Tailwind：`tailwind.config.base.mjs`、`apps/<tenant>/tailwind.config.mjs`
- Fonts/assets：`apps/<tenant>/src/public/fonts`、`src/public/images`

## 流程

- 先判斷是否能用 app-local style 解決；只有跨 tenant 共享需求才改 shared Base component 或 shared token。
- Base component props/slots/class-obj 變更要檢查現有 callers，避免破壞 class override contract。
- PrimeVue token 變更要確認 shared preset 與 tenant preset 的責任邊界。
- Tailwind breakpoints 由 shared constants 生成；不要在 app-local config 製造衝突 breakpoint。
- 顏色調整優先順序：
  - 先復用既有 tenant variables、shared variables、component semantic tokens，例如 `--dialog-*`、`--button-*`、`--input-*`、`--brand-*`、`--color-*`。
  - 不在 shared UI component 直接寫入設計稿 hex / rgb / rgba。
  - 可接受近似視覺時，使用既有變數並在回報中標記「近似替換，非 1:1」。
  - 需要精準符合設計稿且既有變數不足時，新增具語意名稱的 token；避免用 `--color-custom-1` 這類無語意名稱。
  - tenant-only 色彩差異優先放在 `apps/<tenant>/src/assets/styles/_variables*.scss` 或 tenant page 的 `classObj` / theme config；跨 tenant 共用才放 shared。
- 實作後回報 shared vs tenant-local、affected components、states covered，以及需要 browser visual QA 的頁面。
