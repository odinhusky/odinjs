import { PrizeWheelType } from '@libs/mode2/@types/prizeWheelType';
import { PrizeWheelSegmentResult } from '@libs/mode2/external/api/endpoint/promotepParameter/PostPromotePrizeWheelEndpoint';
import { create } from 'zustand';

export interface DepositJackpotWheelModalStoreTypes {
  isShowDepositJackpotWheelModal: boolean;
  setShowDepositJackpotWheelModal: (isShow: boolean) => void;
  depositJackpotWheelSpinList: PrizeWheelSegmentResult[];
  setDepositJackpotWheelSpinList: (list: PrizeWheelSegmentResult[]) => void;

  spinWheelCount: number;
  spinWheel: () => void; // 打API
  resetSpinWheel: () => void;

  prizeWheelIndex: number; // 轉動後的下标|落点 [0 - 7] -1 為無獎品
  setPrizeWheelIndex: (value: number) => void;
  prizeWheelName: string; // 轉動後的獎品名稱
  setPrizeWheelName: (value: string) => void;
  prizeWheelType: PrizeWheelType; // 轉動後的獎品類型
  setPrizeWheelType: (value: PrizeWheelType) => void;
  prizeWheelIcon: number; // 轉動後的獎品編號 [0 - 7]
  setPrizeWheelIcon: (icon: number) => void;

  doubleBuffRechargeBonusLimitedEndTime: number; // 兩倍充值獎勵倒數時間
  setDoubleBuffRechargeBonusLimitedEndTime: (value: number) => void;
  depositJackpotWheelRemainSpin: number; // 可以轉動的次數
  setDepositJackpotWheelRemainSpin: (value: number) => void;

  isShowDepositJackpotWheelRewardModal: boolean;
  setIsShowDepositJackpotWheelRewardModal: (isShow: boolean) => void;

  // 刷新 DepositJackpotWheel  輪盤格，spin數量，是否有兩倍充值
  refreshDepositJackpotWheelCount: number;
  refreshDepositJackpotWheel: () => void;

  spinAnimationFinish: boolean;
  setSpinAnimationFinish: (isFinish: boolean) => void;
  startSpinAnimation: boolean;
  setStartSpinAnimation: (state: boolean) => void;

  lastPrizeWheelRotate: number; // 上一次中獎對應的角度
  setLastPrizeWheelRotate: (rotate: number) => void;
}

const depositJackpotWheelModalDefault = {
  depositJackpotWheelSpinList: [],
  isShowDepositJackpotWheelModal: false,
  isShowDepositJackpotWheelRewardModal: false,

  prizeWheelIndex: -1,
  prizeWheelName: '',
  prizeWheelType: PrizeWheelType.DEPOSIT_BONUS,
  prizeWheelIcon: 0,

  doubleBuffRechargeBonusLimitedEndTime: 0,
  depositJackpotWheelRemainSpin: 0,

  spinWheelCount: 0,
  refreshDepositJackpotWheelCount: 0,

  spinAnimationFinish: false,
  startSpinAnimation: false,

  lastPrizeWheelRotate: 0,
};

export const useDepositJackpotWheelModalStore =
  create<DepositJackpotWheelModalStoreTypes>((set, get) => ({
    ...depositJackpotWheelModalDefault,
    setShowDepositJackpotWheelModal: (isShow) =>
      set(() => ({
        isShowDepositJackpotWheelModal: isShow,
      })),
    setIsShowDepositJackpotWheelRewardModal: (isShow) =>
      set(() => ({
        isShowDepositJackpotWheelRewardModal: isShow,
      })),
    setDepositJackpotWheelSpinList: (list) =>
      set(() => ({
        depositJackpotWheelSpinList: list,
      })),

    setPrizeWheelIndex: (index) =>
      set(() => ({
        prizeWheelIndex: index,
      })),
    setPrizeWheelType: (type) =>
      set(() => ({
        prizeWheelType: type,
      })),
    setPrizeWheelIcon: (icon) =>
      set(() => ({
        prizeWheelIcon: icon,
      })),
    setDoubleBuffRechargeBonusLimitedEndTime: (time) =>
      set(() => ({
        doubleBuffRechargeBonusLimitedEndTime: time,
      })),

    setDepositJackpotWheelRemainSpin: (count) =>
      set(() => ({
        depositJackpotWheelRemainSpin: count,
      })),
    setPrizeWheelName: (name) =>
      set(() => ({
        prizeWheelName: name,
      })),

    spinWheel: () =>
      set(() => ({
        spinWheelCount: 1,
      })),
    resetSpinWheel: () => set(() => ({ spinWheelCount: 0 })),

    refreshDepositJackpotWheel: () =>
      set(() => ({
        refreshDepositJackpotWheelCount:
          get().refreshDepositJackpotWheelCount + 1,
      })),

    setSpinAnimationFinish: (isFinish) =>
      set(() => ({
        spinAnimationFinish: isFinish,
      })),
    setStartSpinAnimation: (state) =>
      set(() => ({
        startSpinAnimation: state,
      })),
    setLastPrizeWheelRotate: (rotate) =>
      set(() => ({
        lastPrizeWheelRotate: rotate,
      })),
  }));

export default useDepositJackpotWheelModalStore;
