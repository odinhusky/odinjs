import { create } from 'zustand';

export interface PlatformDynamicConfigStoreTypes {
  depositBonusUpPercent: number;
  isEnableRankingReward: boolean;
  setEnableRankingReward: (enable: boolean) => void;
  promoteGameIds: number[];
  setPromoteGameIds: (ids: number[]) => void;
  isDisplayRegisterReward: boolean;
  setDisplayRegisterReward: (isDisplay: boolean) => void;
  maxWheelReward: number; // 輪盤最大獎勵，廣告金額
  setMaxWheelReward: (reward: number) => void;
  adGiftBonusRange: { min: number; max: number };
}

export const usePlatformDynamicConfigStore =
  create<PlatformDynamicConfigStoreTypes>((set) => ({
    depositBonusUpPercent: 100,
    isEnableRankingReward: false,
    setEnableRankingReward: (enable) =>
      set(() => ({ isEnableRankingReward: enable })),
    promoteGameIds: [],
    setPromoteGameIds: (ids) => set(() => ({ promoteGameIds: ids })),
    isDisplayRegisterReward: false,
    setDisplayRegisterReward: (isDisplay) =>
      set(() => ({ isDisplayRegisterReward: isDisplay })),
    maxWheelReward: 500,
    setMaxWheelReward: (reward) => set(() => ({ maxWheelReward: reward })),
    adGiftBonusRange: {
      min: 7,
      max: 7777,
    },
  }));
