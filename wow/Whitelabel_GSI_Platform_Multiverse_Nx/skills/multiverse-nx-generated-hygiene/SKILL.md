---
name: multiverse-nx-generated-hygiene
description: 在 whitelabel-gsi-platform-multiverse-nx 中，當使用者要求 review dirty tree、檢查 branch state、處理 generated files、.nx、dist、node_modules、lockfile churn、nx cache、build output、untracked files，或判斷哪些檔案該 commit 時使用。若任務是實作功能本身，請勿使用。
---

# Multiverse Nx Generated Hygiene

此 skill 用於分辨 source、cache、build output 與 dependency churn。不要把 generated artifact 當成目前功能的 source truth。

## 先讀的狀態

- `git status --short`
- `git --no-pager diff --stat`
- `git --no-pager diff --check`
- 必要時檢查 `git --no-pager diff --cached` 與 untracked file path。

## 判斷規則

- `.nx/` 是 Nx cache，不作為 source truth。
- `dist/` 是 build output，不直接手改。
- `node_modules/` 是 installed dependency，不 commit。
- Lockfile 只在 dependency graph 真的變更時保留；若只是安裝副作用，先回報原因。
- `apps/<tenant>`、`libs/shared/ui-layer`、`android/` 是否 source，要依 Git-tracked branch 與使用者指定 scope 判斷。

## 流程

- 先列出 staged、unstaged、untracked 分類；不要只看 tracked diff。
- 對 untracked docs/source file 用 `git --no-pager diff --check --no-index /dev/null <file>` 做 whitespace check。
- 對 generated/cache/build output 只回報，不刪除，除非使用者明確要求 cleanup。
- 若目前 branch 缺少 source，但 cache 指向舊結構，先用 Git branch 或指定 feature branch 讀 source。
- 實作後回報哪些檔案建議 commit、哪些應忽略、哪些需要使用者決定。
