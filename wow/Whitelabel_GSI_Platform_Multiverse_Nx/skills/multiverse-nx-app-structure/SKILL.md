---
name: multiverse-nx-app-structure
description: 在 whitelabel-gsi-platform-multiverse-nx 中，當使用者要求新增、檢查或調整 apps/<tenant>、project.json、nuxt.config.ts、Nx targets、Nuxt app config、app-local assets/theme/plugins/middleware，或 scaffold tenant app 時使用。若只是單一頁面、API、auth、會員中心或 design-system 修改，請勿使用。
---

# Multiverse Nx App Structure

此 skill 只用於 tenant app 與 Nx/Nuxt app 結構。不要用來處理 page 內部功能、shared API 或 Base component behavior。

## 必要資訊

- 目標 tenant app，例如 `apps/r017` 或新 `apps/<tenant>`。
- 任務是新增 app、調整 Nx target、調整 Nuxt config、搬移 app-local assets/theme/plugins/middleware，或檢查現有結構。
- 是否要同步 Android/Capacitor shell；未明確要求時不要改 `android/`。

## 先讀的檔案

- Root：`nx.json`、`package.json`、`tsconfig.base.json`、`tailwind.config.base.mjs`。
- Tenant：`apps/<tenant>/project.json`、`apps/<tenant>/nuxt.config.ts`、`apps/<tenant>/tailwind.config.mjs`、`apps/<tenant>/tsconfig*.json`。
- Shared layer：`libs/shared/ui-layer/nuxt.config.ts`、`libs/shared/ui-layer/project.json`。
- 若目前 checkout 缺少 source，使用指定 feature branch 的同路徑檔案作為結構參考。

## 流程

- 先確認 app 是否已存在；存在時鏡像 sibling tenant pattern，不重新設計 workspace layout。
- 新增或修改 Nx target 時，只改該 project 的 `project.json`，除非 root plugin 設定也必須改。
- App-local Nuxt config 保持 focused：`extends`、`srcDir`、`buildDir`、`devServer`、`imports`、`components`、`css`、`tailwindcss`、`primevue`、`fonts`、`pinia`、`nitro`。
- App-local assets、fonts、themes 與 SCSS 留在 `apps/<tenant>/src`；shared defaults 留在 `libs/shared/ui-layer`。
- 修改後回報 affected project、target/config surface，以及是否碰到 shared layer。
