import { create } from 'zustand';

export enum ActivityRulesContentTypes {
  RED_ENVELOPE_RAIN_RULES_CONTENT = 'RED_ENVELOPE_RAIN_RULES_CONTENT', // 紅包雨
  MONTH_RULES_CONTENT = 'MONTH_RULES_CONTENT', // 團隊俱樂部
  RULES_CONTENT = 'RULES_CONTENT', // 團隊俱樂部
  TEAM_CLUB_RULES_CONTENT = 'TEAM_CLUB_RULES_CONTENT', // 團隊俱樂部 main
  RECHARGE_WHEEL_RULES_CONTENT = 'RECHARGE_WHEEL_RULES_CONTENT', // 充值輪盤
  INVITE_WHEEL_RULES_CONTENT = 'INVITE_WHEEL_RULES_CONTENT', // 邀請輪盤
}

export type ActivityRulesPageStoreTypes = {
  contentTabIndex: ActivityRulesContentTypes | null;
  setContentTabIndex: (index: ActivityRulesContentTypes | null) => void;
};

export const useActivityRulesPageStore = create<ActivityRulesPageStoreTypes>()(
  (set) => ({
    contentTabIndex: null as ActivityRulesContentTypes | null,
    setContentTabIndex: (index) => set(() => ({ contentTabIndex: index })),
  })
);
