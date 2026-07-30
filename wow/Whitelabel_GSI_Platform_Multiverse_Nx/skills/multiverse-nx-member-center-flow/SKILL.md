---
name: multiverse-nx-member-center-flow
description: 在 whitelabel-gsi-platform-multiverse-nx 中，當使用者要求會員中心 summary、history、bank card、orders、pending order、inbox、vip、profile、password、withdrawal password、aside navigation、mobile member content、currency/date filters、table panel 或 pagination 行為時使用。若只是一般 tenant page creation 或 shared API 新增，請勿使用。
---

# Multiverse Nx Member Center Flow

此 skill 用於會員中心功能。會員中心通常同時牽涉 page、component、composable、shared API hook 與 mobile aside flow，先鎖定功能區再改。

## 必要資訊

- 目標 tenant 與 member feature：summary、history、bankCard、orders、inbox、vip、profile、password。
- 目標 surface：page、filter、table/card list、dialog、form、aside navigation、mobile back behavior、API data mapping。
- 是否需要真 API、mock data gate、route query sync、currency wallet state 或 date range sync。

## 先讀的檔案

- `apps/<tenant>/src/pages/member/*.vue`
- `apps/<tenant>/src/components/member*`
- `apps/<tenant>/src/components/history/**`、`pendingOrder/**`、`memberBank/**`
- `apps/<tenant>/src/composables/useSummary/**`、`useHistory/**`、`useMemberBankCard/**`、`usePendingOrder/**`、`useMemberInbox/**`
- `apps/<tenant>/src/constants/memberAside.ts`
- Shared API hooks under `libs/shared/ui-layer/src/lib/api/hooks`

## 流程

- 先確認此 feature 是否已有 focused composable；若有，優先改 composable，不把 page 變成 multi-mode file。
- Summary / history 類型要檢查 route query、currency id/code、date range、loading、mock-data gate 與 chart/table display mapping。
- Bank-card 類型要檢查 type/currency/gateway options、create/edit/delete flow、permission/setting gate 與 query invalidation。
- Aside/mobile content 要檢查 `MemberContainer`、`MemberAsideInfo`、`useMemberAsideNavigation` 與 active key。
- 實作後回報被改的 member feature、API hook usage、mobile state 是否受影響，以及需要人工檢查的 breakpoint。
