import { create } from 'zustand';
import { devtoolsAndPersistWrapper } from '../middlewareWrapper';
import { RechargeWheelType } from '../components/rechargeWheelTabStore';
import {
  AnchorPointResult,
  LevelConfigResult,
  ProgressConfigResult,
  WheelSegmentCategoryResult,
} from '@libs/mode2/external/api/endpoint/wheel/PostWheelConfigEndpoint';
import { rechargeWheelLevelTypeToNumberMapping } from '@libs/mode2/@types/rechargeWheelLevelTypes';

export interface SpinProgressUnit {
  wheelLevel: RechargeWheelType;
  remainingSpins: number;
}

export type LevelConfigWithoutWheelLevel = Omit<
  LevelConfigResult,
  'wheelLevel'
>;

export type WheelLevelConfigObjType = Record<
  RechargeWheelType,
  LevelConfigWithoutWheelLevel
>;

const defaultRechargeWheelNumberObj: Record<RechargeWheelType, number> = {
  silver: 0,
  gold: 0,
  diamond: 0,
  supreme: 0,
};

const defaultWheelSegments = (type: RechargeWheelType) =>
  Array(8)
    .fill('')
    .map((item, index) => ({
      category:
        index + 1 <= 3
          ? WheelSegmentCategoryResult.SPIN
          : WheelSegmentCategoryResult.AMOUNT,
      icon: 0,
      id: index,
      value: 3,
      wheelLevel: rechargeWheelLevelTypeToNumberMapping[type],
    }));

const defaultWheelLevelConfigObj: WheelLevelConfigObjType = {
  silver: {
    maxReward: 0,
    wheelSegments: [...defaultWheelSegments('silver')],
  },
  gold: {
    maxReward: 0,
    wheelSegments: [...defaultWheelSegments('gold')],
  },
  diamond: {
    maxReward: 0,
    wheelSegments: [...defaultWheelSegments('diamond')],
  },
  supreme: {
    maxReward: 0,
    wheelSegments: [...defaultWheelSegments('supreme')],
  },
};

export type ProgressConfigWithoutWheelLevel = Omit<
  ProgressConfigResult,
  'wheelLevel'
>;

export type WheelProgressConfigObjType = Record<
  RechargeWheelType,
  ProgressConfigWithoutWheelLevel
>;

export const defaultAnchorPointList: AnchorPointResult[] = [
  {
    requiredReward: 0,
    receiveSpin: 0,
  },
  {
    requiredReward: 500,
    receiveSpin: 1,
  },
  {
    requiredReward: 1500,
    receiveSpin: 2,
  },
];

const defaultProgressConfigObj: WheelProgressConfigObjType = {
  silver: {
    maxRequiredReward: 1100,
    anchorPointList: [
      {
        requiredReward: 0,
        receiveSpin: 0,
      },
    ],
  },
  gold: {
    maxRequiredReward: 5000,
    anchorPointList: [
      {
        requiredReward: 0,
        receiveSpin: 0,
      },
    ],
  },
  diamond: {
    maxRequiredReward: 40000,
    anchorPointList: [
      {
        requiredReward: 0,
        receiveSpin: 0,
      },
    ],
  },
  supreme: {
    maxRequiredReward: 90000,
    anchorPointList: [
      {
        requiredReward: 0,
        receiveSpin: 0,
      },
    ],
  },
};

export interface Mode2RechargeWheelPageStoreTypes {
  postPlayerProgressCount: number;
  refreshPostPlayerProgressCount: () => void;

  currentDeposit: number;
  setCurrentDeposit: (num: number) => void;

  wheelRemainSpinNumberObj: Record<RechargeWheelType, number>;
  setWheelRemainSpinNumberObj: (
    wheelRemainSpinNumberObj: Record<RechargeWheelType, number> | {}
  ) => void;

  rechargeWheelMaxReward: number;
  setRechargeWheelMaxReward: (rechargeWheelMaxReward: number) => void;

  wheelLevelConfigObj: WheelLevelConfigObjType;
  setWheelLevelConfigObj: (
    wheelLevelConfigObj: WheelLevelConfigObjType | {}
  ) => void;

  progressConfigObj: WheelProgressConfigObjType;
  setProgressConfigObj: (
    progressConfigObj: WheelProgressConfigObjType | {}
  ) => void;

  spinWheelCount: number;
  spinWheel: () => void;

  spinWheelLevel: RechargeWheelType;
  setSpinWheelLevel: (spinWheelLevel: RechargeWheelType) => void;

  spinedRewardLevel: RechargeWheelType;
  setSpinedRewardLevel: (spinWheelLevel: RechargeWheelType) => void;

  spinedRewardIndex: number;
  setSpinedRewardIndex: (spinedRewardIndex: number) => void;

  spinedRewardIsMoney: boolean;
  setSpinedRewardIsMoney: (spinedRewardIsMoney: boolean) => void;

  spinedRewardValue: number;
  setSpinedRewardValue: (spinedRewardValue: number) => void;

  spinedAPIDoneCount: number;
  addSpinedAPIDoneCount: () => void;

  isAnimatingObj: Record<RechargeWheelType, boolean>;
  setIsAnimatingObj: (key: RechargeWheelType, value: boolean) => void;

  isCurrentWheelSlowSpin: boolean;
  setIsCurrentWheelSlowSpin: (isCurrentWheelSlowSpin: boolean) => void;
}

export const useMode2RechargeWheelPageStore =
  create<Mode2RechargeWheelPageStoreTypes>()(
    devtoolsAndPersistWrapper(
      '[page store] useMode2TeamClubPageShareForBonusStore',
      (set, get) => ({
        postPlayerProgressCount: 0,
        refreshPostPlayerProgressCount: () =>
          set(() => ({
            postPlayerProgressCount: get().postPlayerProgressCount + 1,
          })),

        currentDeposit: 0,
        setCurrentDeposit: (num) =>
          set(() => ({
            currentDeposit: num,
          })),

        wheelRemainSpinNumberObj: {
          ...defaultRechargeWheelNumberObj,
        },
        setWheelRemainSpinNumberObj: (wheelRemainSpinNumberObj) =>
          set(() => ({
            wheelRemainSpinNumberObj: {
              ...get().wheelRemainSpinNumberObj,
              ...wheelRemainSpinNumberObj,
            },
          })),

        rechargeWheelMaxReward: 0,
        setRechargeWheelMaxReward: (rechargeWheelMaxReward) =>
          set(() => ({ rechargeWheelMaxReward })),

        wheelLevelConfigObj: {
          ...defaultWheelLevelConfigObj,
        },
        setWheelLevelConfigObj: (wheelLevelConfigObj) =>
          set(() => ({
            wheelLevelConfigObj: {
              ...get().wheelLevelConfigObj,
              ...wheelLevelConfigObj,
            },
          })),

        progressConfigObj: { ...defaultProgressConfigObj },
        setProgressConfigObj: (progressConfigObj) =>
          set(() => ({
            progressConfigObj: {
              ...get().progressConfigObj,
              ...progressConfigObj,
            },
          })),

        spinWheelCount: 0,
        spinWheel: () =>
          set(() => ({
            spinWheelCount: get().spinWheelCount + 1,
          })),

        spinWheelLevel: 'silver' as RechargeWheelType,
        setSpinWheelLevel: (spinWheelLevel) =>
          set(() => ({
            spinWheelLevel,
          })),

        spinedRewardLevel: 'silver' as RechargeWheelType,
        setSpinedRewardLevel: (spinedRewardLevel) =>
          set(() => ({
            spinedRewardLevel,
          })),

        spinedRewardIndex: 0,
        setSpinedRewardIndex: (spinedRewardIndex) =>
          set(() => ({
            spinedRewardIndex,
          })),

        spinedRewardIsMoney: false,
        setSpinedRewardIsMoney: (spinedRewardIsMoney) =>
          set(() => ({
            spinedRewardIsMoney,
          })),

        spinedRewardValue: 0,
        setSpinedRewardValue: (spinedRewardValue) =>
          set(() => ({
            spinedRewardValue,
          })),

        spinedAPIDoneCount: 0,
        addSpinedAPIDoneCount: () =>
          set(() => ({
            spinedAPIDoneCount: get().spinedAPIDoneCount + 1,
          })),

        isAnimatingObj: {
          silver: false,
          gold: false,
          diamond: false,
          supreme: false,
        },
        setIsAnimatingObj: (key, value) =>
          set({ isAnimatingObj: { ...get().isAnimatingObj, [key]: value } }),

        isCurrentWheelSlowSpin: true,
        setIsCurrentWheelSlowSpin: (isCurrentWheelSlowSpin) =>
          set(() => ({
            isCurrentWheelSlowSpin,
          })),
      })
    )
  );

export default useMode2RechargeWheelPageStore;
