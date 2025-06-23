import { create } from 'zustand';

export enum AnimationType {
  RECHARGE_WHEEL_GET_MONEY = 'rechargeWheelGetMoney',
  GIFT_CODE_SUCCESS = 'giftCodeSuccess',
  DAILY_BET_REBATE_CLAIM = 'popup_bet_rebate_3',
}

export interface FullAnimationStoreType {
  isShowFullAnimation: boolean;
  setIsShowFullAnimation: (value: boolean) => void;
  fullAnimationType: AnimationType | '';
  setFullAnimationType: (type: AnimationType) => void;
  fullAnimationDuration: number;
  setFullAnimationDuration: (duration: number) => void;
  openFullAnimation: (params: {
    type: AnimationType;
    duration: number;
  }) => void;
}

export const fullAnimationStore = create<FullAnimationStoreType>()((set) => ({
  isShowFullAnimation: false,
  setIsShowFullAnimation: (value) =>
    set(() => ({
      isShowFullAnimation: value,
    })),
  fullAnimationType: '',
  setFullAnimationType: (type) =>
    set({
      fullAnimationType: type,
    }),
  fullAnimationDuration: 1000,
  setFullAnimationDuration: (duration) =>
    set(() => ({
      fullAnimationDuration: duration,
    })),

  openFullAnimation: ({ type, duration }) =>
    set(() => ({
      isShowFullAnimation: true,
      fullAnimationType: type,
      fullAnimationDuration: duration,
    })),
}));

export default fullAnimationStore;
