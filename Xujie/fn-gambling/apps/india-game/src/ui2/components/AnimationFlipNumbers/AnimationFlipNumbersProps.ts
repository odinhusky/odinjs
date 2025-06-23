import { FlipNumbersResType } from '@mode2/@types/flipNumbersResType';

export interface AnimationFlipNumbersProps {
  numbers: string; // 只能包含 0~9 的數字字串,以及.
  dollarClassName?: string;
  hasDollarSign?: boolean;
  height?: number; // 以 px 為單位
  amountHeight?: number; // 貨幣符號 以 px 為單位
  resType?: FlipNumbersResType;
}
