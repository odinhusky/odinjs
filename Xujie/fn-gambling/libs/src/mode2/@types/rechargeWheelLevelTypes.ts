import { RechargeWheelType } from '../zustand/components/rechargeWheelTabStore';

export enum RechargeWheelLevelType {
  TIER_SILVER = 1, //白銀
  TIER_GOLD = 2, // 黃金
  TIER_DIAMOND = 3, //鑽石
  TIER_SUPREME = 4, //至尊
}

export const rechargeWheelLevelTypeMapping: Record<number, RechargeWheelType> =
  {
    1: 'silver',
    2: 'gold',
    3: 'diamond',
    4: 'supreme',
  };

export const rechargeWheelLevelTypeToNumberMapping: Record<
  RechargeWheelType,
  number
> = {
  silver: 1,
  gold: 2,
  diamond: 3,
  supreme: 4,
};

export const rechargeWheelLevelMapping: Record<number, RechargeWheelLevelType> =
  {
    [1]: RechargeWheelLevelType.TIER_SILVER,
    [2]: RechargeWheelLevelType.TIER_GOLD,
    [3]: RechargeWheelLevelType.TIER_DIAMOND,
    [4]: RechargeWheelLevelType.TIER_SUPREME,
  };

export const rechargeWheelLevelToWheelLevelTypeMapping: Record<
  RechargeWheelLevelType,
  RechargeWheelType
> = {
  [RechargeWheelLevelType.TIER_SILVER]: 'silver',
  [RechargeWheelLevelType.TIER_GOLD]: 'gold',
  [RechargeWheelLevelType.TIER_DIAMOND]: 'diamond',
  [RechargeWheelLevelType.TIER_SUPREME]: 'supreme',
};

// 取得所有的 WheelLevelResult
export const allRechargeWheelLevels = [
  rechargeWheelLevelMapping[1],
  rechargeWheelLevelMapping[2],
  rechargeWheelLevelMapping[3],
  rechargeWheelLevelMapping[4],
];
