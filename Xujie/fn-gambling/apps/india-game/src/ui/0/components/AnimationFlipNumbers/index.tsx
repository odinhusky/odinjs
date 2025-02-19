import { FlipNumbersResType } from '@components/AnimationFlipNumbersDigit';

interface AnimationFlipNumbersProps {
  numbers: string; // 只能包含 0~9 的數字字串,以及.
  hasDollarSign?: boolean;
  height?: number; // 以 px 為單位
  resType?: FlipNumbersResType;
}

export const AnimationFlipNumbers = ({
  height,
  numbers,
  hasDollarSign = true,
  resType = FlipNumbersResType.AMOUNT_NUMBER,
}: AnimationFlipNumbersProps) => {
  return null;
};

export default AnimationFlipNumbers;
