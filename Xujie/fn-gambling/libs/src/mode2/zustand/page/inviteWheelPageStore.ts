import { create } from 'zustand';
import { InviteWheelRewardResult } from '@libs/mode2/external/api/endpoint/wheel/PostInviteWheelRewardListEndpoint';
import {
  DEFAULT_EVENT_COUNT_DOWN,
  DEFAULT_FREE_SPIN_COUNT_DOWN,
  InviteWheelPortalInfoResult,
  InviteWheelSpinType,
} from '@libs/mode2/external/api/endpoint/wheel/PostInviteWheelPortalInfoEndpoint';
import { WheelNewsTickerResult } from '@libs/mode2/external/api/endpoint/wheel/PostWheelNewsTickerListEndpoint';

interface InviteWheelAnimateStore {
  isAnimating: boolean;
  setIsAnimating: (value: boolean) => void;
}

export const useInviteWheelPageAnimateStore = create<InviteWheelAnimateStore>(
  (set) => ({
    isAnimating: false,
    setIsAnimating: (value) => set(() => ({ isAnimating: value })),
  })
);

export interface InviteWheelPageStoreTypes {
  eventCountDown: number;
  remindFreeSpin: number;
  remindSpin: number;
  spinWheelCount: number;
  spinWheel: () => void;
  resetSpinWheel: () => void;
  spinedIndex: number;
  setSpinedIndex: (value: number) => void;
  spinedReward: number;
  setSpinedReward: (value: number) => void;
  spinFastTotate: boolean;
  setSpinFastTotate: (value: boolean) => void;

  marqueeText: WheelNewsTickerResult[];
  setMarqueeText: (marqueeText: WheelNewsTickerResult[]) => void;
  inviteWheelPortalInfo: InviteWheelPortalInfoResult;
  setInviteWheelPortalInfo: (value: InviteWheelPortalInfoResult) => void;
  inviteWheelSpinRecord: InviteWheelRewardResult[] | null;
  setInviteWheelSpinRecord: (items: InviteWheelRewardResult[]) => void;
  refreshRemindSpin: () => void;

  isShowInviteWheelTipsModal: boolean;
  setIsShowInviteWheelTipsModal: (isShowInviteWheelTipsModal: boolean) => void;

  isShowPinduoduoFreeDrawModal: boolean;
  setShowPinduoduoFreeDrawModal: (isShow: boolean) => void;

  requireCumulativeAmount: number; // 需要累積金額，才可領去
  setRequireCumulativeAmount: (requireCumulative: number) => void;
  remainFreeSpinCountDown: number; // 預設1天
  setRemainFreeSpinCountDown: (remainTime: number) => void;
  withdrawCompletionRate: number; // 可領取完成比例
  setWithdrawCompletionRate: (rate: number) => void;
  cashOutRewardDifference: number; // 剩餘多少可領取
  setCashOutRewardDifference: (difference: number) => void;

  isParticipated: boolean; // 是否正在參與中
  setParticipated: (isParticipated: boolean) => void;
  refreshInfoNumber: number; // 刷新資料
  setRefreshInfoNumber: () => void;

  inviteWheelSpinToastFinish: boolean;
  setInviteWheelSpinToastFinish: (isFinish: boolean) => void;

  resetState: () => void;
}

const inviteWheelPageDefault = {
  remindFreeSpin: 0,
  remindSpin: 0,
  eventCountDown: DEFAULT_EVENT_COUNT_DOWN,
  isWithdrawal: false,
  spinWheelCount: 0,
  spinedIndex: 0,
  spinedReward: 0,
  spinFastTotate: false,
  marqueeText: [] as WheelNewsTickerResult[],
  inviteWheelSpinRecord: null as InviteWheelRewardResult[] | null,
  inviteWheelPortalInfo: {} as InviteWheelPortalInfoResult,
  isShowInviteWheelTipsModal: false,
  isShowPinduoduoFreeDrawModal: false,
  requireCumulativeAmount: 500,
  remainFreeSpinCountDown: DEFAULT_FREE_SPIN_COUNT_DOWN,
  withdrawCompletionRate: 0,
  cashOutRewardDifference: 500,
  isParticipated: true,
  refreshInfoNumber: -1,
  inviteWheelSpinToastFinish: true,
};

export const useInviteWheelPageStoreStore = create<InviteWheelPageStoreTypes>(
  (set, get) => ({
    ...inviteWheelPageDefault,
    spinWheelCount: 0,
    spinWheel: () =>
      set(() => ({
        spinWheelCount: get().spinWheelCount + 1,
      })),
    resetSpinWheel: () => set(() => ({ spinWheelCount: 0 })),
    setSpinFastTotate: (value) => set(() => ({ spinFastTotate: value })),

    setSpinedIndex: (index) => set(() => ({ spinedIndex: index })),
    setSpinedReward: (index) => set(() => ({ spinedReward: index })),
    setMarqueeText: (marqueeText) => set(() => ({ marqueeText: marqueeText })),
    setInviteWheelPortalInfo: (value) =>
      set(() => ({
        inviteWheelPortalInfo: value,
        eventCountDown: value.eventCountDown,
        nextFreeSpinCountDown: value.nextFreeSpinCountDown,
        remindFreeSpin:
          value.spinType === InviteWheelSpinType.FREE_SPIN
            ? value.remindSpin
            : 0,
        remindSpin:
          value.spinType === InviteWheelSpinType.INVITE_SPIN
            ? value.remindSpin
            : 0,
      })),
    refreshRemindSpin: () =>
      set((state: InviteWheelPageStoreTypes) => {
        if (state.remindFreeSpin) {
          return {
            remindFreeSpin: state.remindFreeSpin - 1,
          };
        } else if (state.remindSpin) {
          return { remindSpin: state.remindSpin - 1 };
        } else {
          return {};
        }
      }),
    setInviteWheelSpinRecord: (items) =>
      set(() => ({ inviteWheelSpinRecord: items })),

    setIsShowInviteWheelTipsModal: (isShowInviteWheelTipsModal) =>
      set(() => ({
        isShowInviteWheelTipsModal,
      })),
    setShowPinduoduoFreeDrawModal: (isShow) =>
      set(() => ({
        isShowPinduoduoFreeDrawModal: isShow,
      })),
    setRequireCumulativeAmount: (requireCumulative) =>
      set(() => ({
        requireCumulativeAmount: requireCumulative,
      })),
    setRemainFreeSpinCountDown: (remainTime) =>
      set(() => ({
        remainFreeSpinCountDown: remainTime,
      })),
    setWithdrawCompletionRate: (rate: number) =>
      set(() => ({
        withdrawCompletionRate: rate,
      })),
    setCashOutRewardDifference: (difference: number) =>
      set(() => ({
        cashOutRewardDifference: difference,
      })),
    setParticipated: (isParticipated: boolean) =>
      set(() => ({
        isParticipated: isParticipated,
      })),
    setRefreshInfoNumber: () =>
      set(() => ({
        refreshInfoNumber: get().refreshInfoNumber + 1,
      })),
    setInviteWheelSpinToastFinish: (isFinish) =>
      set(() => ({
        inviteWheelSpinToastFinish: isFinish,
      })),
    resetState: () =>
      set(() => ({
        ...inviteWheelPageDefault,
      })),
  })
);

interface InviteWheelRuleModalType {
  isDisplay: boolean;
  showInviteWheelRuleModal: () => void;
  dismissInviteWheelRuleModal: () => void;
}

export const useInviteWheelRuleModalStore = create<InviteWheelRuleModalType>(
  (set) => ({
    isDisplay: false,
    showInviteWheelRuleModal: () => set(() => ({ isDisplay: true })),
    dismissInviteWheelRuleModal: () => set(() => ({ isDisplay: false })),
  })
);
