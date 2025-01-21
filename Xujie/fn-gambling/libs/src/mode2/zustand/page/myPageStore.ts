import { create } from 'zustand';
import {
  devtoolsAndPersistWrapper,
  devtoolsWrapper,
} from '../middlewareWrapper';
import { VipInfo } from '@mode2/external/api/endpoint/team/PostVIPHomeEndpoint';
import { ActionClickPayloadMap } from '@mode2/action/myPageAction/useMyPageActions';
import { I18NContent } from '@libs/mode2/@types/i18nType';

type ActionKeys = keyof ActionClickPayloadMap;
export interface LineBtnUnit {
  iconName: string;
  name: I18NContent;
  isBorder: boolean;
  color?: string; // 'var(--grayscale-100)'
  // actionName: ActionKeys;
  // payload?: ActionClickPayloadMap[ActionKeys];
  isShowRedDot: boolean;
  isShowArrow: boolean;
  onAction: () => void;
}

export interface MyPageStoreTypes {
  openMyDrawer: boolean;
  vipProgressPercent: number;
  setVipProgressPercent: (percent: number) => void;
  betProgressPercent: number;
  setBetProgressPercent: (percent: number) => void;
  lineBtnList: LineBtnUnit[];
  setLineBtnList: (list: LineBtnUnit[]) => void;
  rechargeAmount: number;
  setRechargeAmount: (amount: number) => void;
  vipInfos: VipInfo[];
  setVipTableDatas: (data: VipInfo[]) => void;
  vipLevel: number;
  setVipLevel: (level: number) => void;
  setOpenMyDrawer: (open: boolean) => void;
  toggleMyDrawer: () => void;
  clear: () => void;
}

export const useMyPageStore = create<MyPageStoreTypes>()(
  devtoolsAndPersistWrapper('[page store] useMyPageStore', (set) => ({
    openMyDrawer: false,
    vipProgressPercent: 0,
    setVipProgressPercent: (percent) =>
      set(() => ({ vipProgressPercent: percent })),
    betProgressPercent: 0,
    setBetProgressPercent: (percent) =>
      set(() => ({ betProgressPercent: percent })),
    lineBtnList: [] as LineBtnUnit[],
    setLineBtnList: (list) => set(() => ({ lineBtnList: list })),
    rechargeAmount: 0,
    setRechargeAmount: (amount) => set(() => ({ rechargeAmount: amount })),
    vipInfos: [] as VipInfo[],
    setVipTableDatas: (data) => set(() => ({ vipInfos: data })),
    vipLevel: 0,
    setVipLevel: (level) => set(() => ({ vipLevel: level })),
    setOpenMyDrawer: (openMyDrawer) =>
      set(() => ({ openMyDrawer: openMyDrawer })),
    toggleMyDrawer: () =>
      set((state: MyPageStoreTypes) => ({ openMyDrawer: !state.openMyDrawer })),
    clear: () => set(() => ({ vipLevel: 0, rechargeAmount: 0 })),
  }))
);
export interface LineBtnActionObj {
  [key: string]: () => void;
}

// interface MyPageActionsStoreTypes {
//   lineBtnActionObj: LineBtnActionObj;
//   setLineBtnActionObj: (obj: LineBtnActionObj) => void;
// }
//
// export const useMyPageActionsStore = create<MyPageActionsStoreTypes>()(
//   devtoolsWrapper('[MyPage Action store] useMyPageActionsStore', (set) => ({
//     lineBtnActionObj: {} as LineBtnActionObj,
//     setLineBtnActionObj: (obj) => set(() => ({ lineBtnActionObj: obj })),
//   }))
// );
