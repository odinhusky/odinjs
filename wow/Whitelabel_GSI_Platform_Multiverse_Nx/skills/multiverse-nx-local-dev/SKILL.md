---
name: multiverse-nx-local-dev
description: 在 whitelabel-gsi-platform-multiverse-nx 中，當使用者要求啟動、確認或排查 tenant 本地開發服務、Nuxt prepare、Nx serve、localhost URL 或 dev server 狀態時使用。
---

# Multiverse Nx Local Dev

此 skill 用於本地開發服務啟動與確認。不要把 lint、build、E2E、部署或遠端環境操作混進本流程。

## 使用時機

- 使用者要求「起服務」、「開 localhost」、「跑本地 dev server」。
- 使用者要求確認 tenant app 是否能在本地開發環境啟動。
- 使用者提供或詢問 `nuxi prepare`、`nx serve`、`localhost`、dev server port。

## 不使用時機

- 只做程式修改、功能實作或 code review。
- 要跑 lint/build/test 時，依任務與治理文件另行確認。
- production、staging、CI/CD、部署、資料庫、外部 API 或雲端資源操作。

## 必要資訊

- 目標 tenant，例如 `r017`。
- 預期網址或 port，例如 `http://localhost:9000/`。
- 是否需要 mock env；未明確要求時不要自行加入 mock env。

## R017 標準本地啟動流程

在 repo root 執行：

```bash
npx nuxi prepare apps/r017
pnpm exec nx serve r017
```

預期網址：

```txt
http://localhost:9000/
```

## 工作流程

1. 先確認是否已有服務：

   ```bash
   curl -I http://localhost:9000/
   ```

2. 若無服務，先執行 Nuxt prepare：

   ```bash
   npx nuxi prepare apps/r017
   ```

3. 啟動 R017 dev server：

   ```bash
   pnpm exec nx serve r017
   ```

4. 等待 Nuxt 顯示 local URL 後，再確認：

   ```bash
   curl -I http://localhost:9000/
   ```

5. 回報：
   - localhost URL。
   - 是否回 `200 OK`。
   - dev server 是否仍在背景執行。
   - 若失敗，回報錯誤重點與下一步建議。

## Codex 沙盒注意事項

- 若在 Codex sandbox 內執行 Nx 出現類似：

  ```txt
  Error: listen EPERM: operation not permitted ... fp*.sock
  ```

  這通常是本機 IPC socket 被沙盒限制，不代表專案程式錯。

- 需要啟動 dev server 時，改用授權後的沙盒外執行。
- 若專案治理要求 shell command 加上 `rtk`，執行時遵守治理；但回報給 RD 的專案原始指令仍保留：

  ```bash
  npx nuxi prepare apps/r017
  pnpm exec nx serve r017
  ```

## 常見錯誤

- 未先跑 `nuxi prepare`，導致 Nuxt 型別或 imports 尚未生成。
- 把 `pnpm nx serve r017`、`pnpm exec nx serve r017`、`nuxi dev` 混用時未說明差異。
- dev server 已存在還重複啟動，造成 port 衝突。
- 自行加入 mock env，導致使用者看到的不是預期資料。
- 把 dev server 啟動與 lint/build 驗證混在同一個流程。

## 完成與驗收

- `http://localhost:9000/` 可連線。
- `curl -I http://localhost:9000/` 回 `200 OK` 或清楚回報非 200 狀態。
- 回覆中提供可點擊 localhost URL。
- 若服務無法啟動，回覆包含失敗原因、是否為 sandbox/port/dependency 問題，以及建議下一步。
