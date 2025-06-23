import { create } from 'zustand';
import { VipInfo } from '@mode2/external/api/endpoint/team/PostVIPHomeEndpoint';
import { I18NContent } from '@libs/mode2/@types/i18nType';

export interface LineBtnUnit {
  iconName: string;
  name: I18NContent;
  isBorder: boolean;
  color?: string; // 'var(--grayscale-100)'
  // actionName: ActionKeys;
  // payload?: ActionClickPayloadMap[ActionKeys];
  isShowRedDot: boolean;
  unReadCount: number;
  isShowArrow: boolean;
  onAction: () => void;
}

export enum MyPageBtnListScenarios {
  DEFAULT = 'DEFAULT',
  GIFT_CODE = 'GIFT_CODE',
  V6_VERSION_DEFAULT = 'V6_VERSION_DEFAULT',
}

interface UsageScenarios {
  scenarios: MyPageBtnListScenarios;
  usageScenariosList: LineBtnUnit[];
}

export interface MyPageStoreTypes {
  openMyDrawer: boolean;
  vipProgressPercent: number;
  setVipProgressPercent: (percent: number) => void;
  betProgressPercent: number;
  setBetProgressPercent: (percent: number) => void;
  lineBtnList: LineBtnUnit[];
  setLineBtnList: (list: LineBtnUnit[]) => void;
  usageScenariosList: UsageScenarios[];
  setUsageScenariosList: (list: UsageScenarios[]) => void;
  rechargeAmount: number;
  setRechargeAmount: (amount: number) => void;
  lackRechargeAmount: number;
  setLackRechargeAmount: (lackRechargeAmount: number) => void;
  vipRewardDama: number;
  setVipRewardDama: (rewardDama: number) => void;
  vipInfos: VipInfo[];
  setVipTableDatas: (data: VipInfo[]) => void;
  setOpenMyDrawer: (open: boolean) => void;
  toggleMyDrawer: () => void;
  isLogoutWeakTipsModalShow: boolean;
  setIsLogoutWeakTipsModalShow: (isShow: boolean) => void;
  clear: () => void;
}

export const useMyPageStore = create<MyPageStoreTypes>()((set) => ({
  openMyDrawer: false,
  vipProgressPercent: 0,
  setVipProgressPercent: (percent) =>
    set(() => ({ vipProgressPercent: percent })),
  betProgressPercent: 0,
  setBetProgressPercent: (percent) =>
    set(() => ({ betProgressPercent: percent })),
  lineBtnList: [] as LineBtnUnit[],
  setLineBtnList: (list) => set(() => ({ lineBtnList: list })),
  usageScenariosList: [] as UsageScenarios[],
  setUsageScenariosList: (list) => set(() => ({ usageScenariosList: list })),
  rechargeAmount: 0,
  setRechargeAmount: (amount) => set(() => ({ rechargeAmount: amount })),
  lackRechargeAmount: 0,
  setLackRechargeAmount: (amount) =>
    set(() => ({ lackRechargeAmount: amount })),
  vipRewardDama: 0,
  setVipRewardDama: (rewardDama) => set(() => ({ vipRewardDama: rewardDama })),
  vipInfos: [] as VipInfo[],
  setVipTableDatas: (data) => set(() => ({ vipInfos: data })),
  setOpenMyDrawer: (openMyDrawer) =>
    set(() => ({ openMyDrawer: openMyDrawer })),
  toggleMyDrawer: () =>
    set((state: MyPageStoreTypes) => ({ openMyDrawer: !state.openMyDrawer })),
  isLogoutWeakTipsModalShow: false,
  setIsLogoutWeakTipsModalShow: (isShow: boolean) =>
    set(() => ({
      isLogoutWeakTipsModalShow: isShow,
    })),
  clear: () => set(() => ({ vipLevel: 0, rechargeAmount: 0 })),
}));
export interface LineBtnActionObj {
  [key: string]: () => void;
}
