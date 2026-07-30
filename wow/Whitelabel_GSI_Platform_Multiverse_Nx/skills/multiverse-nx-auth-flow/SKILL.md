---
name: multiverse-nx-auth-flow
description: 在 whitelabel-gsi-platform-multiverse-nx 中，當使用者提到 login、register、SMS login、phone login、forgot password、reset password、TOTP、OAuth、Telegram/Google login、token store、auth middleware、guest-only route、auth-required route、country code 或 auth payload 時使用。
---

# Multiverse Nx Auth Flow

Auth task 先判斷是 tenant UI、shared API contract、token store，還是 route middleware。不要只改表單畫面而漏掉 payload 或 route guard。

## 必要資訊

- 目標 tenant 或 shared auth behavior。
- 目標 surface：login、register、SMS login、phone password login、forgot password、reset password、TOTP、OAuth、middleware。
- Backend payload contract 與成功後行為，例如 token 寫入、redirect、profile/wallet refresh。
- 是否要新增 API wrapper；若是 brand-new endpoint，搭配 shared API skill。

## 先讀的檔案

- Tenant：`apps/<tenant>/src/pages/login*.vue`、`register.vue`、`forgotPassword.vue`、`ForgotPass/[token].vue`
- Tenant components：`components/login/**`、`components/register/**`、`components/forgotPass/**`、`components/dialogs/**`
- Tenant stores：`apps/<tenant>/src/stores/loginStore.ts`
- Middleware：`apps/<tenant>/src/middleware/auth-middleware.global.ts`
- Shared：`libs/shared/ui-layer/src/lib/composables/useAuth.ts`、`stores/auth.ts`、`constants/loginMethod.ts`、`constants/registerMethod.ts`、`constants/routePath.ts`
- Shared API wrappers：`apiFunctions/auth_*.ts`、`commonTypes/authTypes.ts`

## 流程

- 先確認 API wrapper 是否已存在；已存在時不要新增 duplicate endpoint。
- Login/register payload 以 shared `auth_*.ts` wrapper 型別為 source of truth，UI form state 只做 mapping。
- Route guard 變更要同步檢查 `AUTH_ROUTE_GROUPS`、dynamic route prefix 與 guest-only redirect。
- Token 行為集中在 shared auth store/composable；tenant UI 不直接分散 token persistence。
- 實作後回報 payload path、token/redirect behavior、route guard 是否改變，以及受影響的 auth pages/components。
