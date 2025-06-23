export enum PrizeWheelType {
  DEVICE = 'DEVICE', // 1
  CASH = 'CASH', // 2
  SPIN = 'SPIN', // 3
  DEPOSIT_BONUS = 'DEPOSIT_BONUS', // 4
  NONE = 'NONE',
}

export const prizeWheelTypeMapping: Record<number, PrizeWheelType> = {
  [0]: PrizeWheelType.NONE,
  [1]: PrizeWheelType.DEVICE,
  [2]: PrizeWheelType.CASH,
  [3]: PrizeWheelType.SPIN,
  [4]: PrizeWheelType.DEPOSIT_BONUS,
};
