# r017 dev/build 指令設計

## 背景

`r017` tenant app 已在 `apps/r017/project.json` 定義 Nx targets：

- `prepare`：產生 runtime theme CSS 到 `apps/r017/src/public/themes`。
- `serve`：執行 `scripts/serve-r017-with-theme-watch.mjs`。
- `build`：透過 `dependsOn` 依賴 `prepare`，再執行 `nuxi generate`。

root `package.json` 目前沒有 scripts。本次目標是新增短入口指令，同時維持 Nx targets 作為單一事實來源（source of truth）。

## 目標

- 新增 root dev 指令給 `r017`。
- 新增 root build 指令給 `r017`。
- 保持 `r017` Nx targets 作為標準實作入口。
- 確保 dev 啟動時，先執行 Nuxt prepare，再啟動既有 watcher 與 dev server。
- build 只產出一份 `r017` 靜態 artifact。
- `env.js` 替換交給 CI 或部署路徑在 build 後處理。

## 非目標

- 不針對不同版型產生多份 build artifacts。
- 不新增版型專用 build 指令。
- 不在 `build:r017` 期間複製、產生或替換 `env.js`。
- 不修改 production、staging、CI/CD、部署或外部環境行為。
- 不修改 runtime config keys 或 app 功能行為。

## 建議指令

root `package.json` 應提供：

```json
{
  "scripts": {
    "dev:r017": "pnpm exec nx serve r017",
    "build:r017": "pnpm exec nx build r017"
  }
}
```

這兩個指令只作為短入口，實際行為仍委派給 Nx。

## Dev 流程

`pnpm dev:r017` 應呼叫 `pnpm exec nx serve r017`。

`r017` 的 `serve` target 應確保下列順序：

1. 對 `apps/r017` 執行 Nuxt prepare。
2. 啟動既有 runtime theme watcher。
3. 啟動既有 Nuxt dev server。

目前 `scripts/serve-r017-with-theme-watch.mjs` 已負責 watcher 與 dev server lifecycle，因此最適合在這支 script 內保證啟動順序。

## Build 流程

`pnpm build:r017` 應呼叫 `pnpm exec nx build r017`。

既有 `r017` `build` target 維持負責：

1. 透過 `dependsOn` 執行 `prepare`。
2. 執行 `nuxi generate`。
3. 依目前設定輸出靜態檔到 `dist/apps/r017/.output`。

Build 不選版型，只產出一份 `r017` 靜態 artifact。

## Runtime env.js 處理

`env.js` 維持為 runtime deployment concern。

目前行為：

- Source file：`apps/r017/src/public/env.js`。
- Example file：`apps/r017/src/public/env.gsai.example.js`。
- Nuxt 會把 `apps/r017/src/public/env.js` 複製到 generated public output。
- `apps/r017/nuxt.config.ts` 會在 document head 載入 `/env.js`。
- `apps/r017/src/plugins/runtime-env.client.ts` 讀取 `window.__ENV__`，並覆寫 public runtime config。

CI 或部署流程可在 `build:r017` 完成後替換 generated `/env.js`。

## 預期實作會修改的檔案

- `package.json`：新增 `dev:r017` 與 `build:r017` scripts。
- `scripts/serve-r017-with-theme-watch.mjs`：在啟動 watcher 與 dev server 前先執行 Nuxt prepare。

本任務不預期修改 `apps/r017/src/public/env.js`。

## 驗證計畫

實作後建議的 focused checks：

- 檢查 `package.json` 是否存在預期 scripts。
- 只有在明確授權時才執行 `pnpm dev:r017`，因為它會啟動 dev server。
- 只有在明確授權時才執行 `pnpm build:r017`，因為它會執行 build。
- 若未授權 runtime execution，則以靜態方式 review command wiring。

## 風險

- 若必須精準使用 root command 形式的 `nuxi prepare apps/r017`，實作時需確認 command working directory behavior。
- 若 `nuxi prepare` 失敗，dev script 應停止，不應繼續啟動 watcher 或 dev server。
- 由於 build 刻意不替換 `env.js`，CI 或部署流程必須為各版型提供正確 runtime file。
