import { WheelCategory } from '@components/SpinWheel';
import { cx } from '@libs/commonUtils';

const wheelRewardTextStyleProps = {
  className: cx(
    'block',
    'text-sm font-semibold',
    'leading-[14px]',
    'bgi-text-[var(--grayscale/100)]'
  ),
  style: {
    textShadow: 'var(--text-shadow-gray-70)',
  },
};

interface SpinWheelRewardTextProps {
  isMoneyAsReward: boolean;
  category: WheelCategory;
  value: number | number[];
  rewardWheelType: string;
  rouletteClass: string;
  rewardTitleClass?: string;
}

export const SpinWheelRewardText = ({
  isMoneyAsReward,
  category,
  value,
  rewardWheelType,
  rouletteClass,
  rewardTitleClass,
}: SpinWheelRewardTextProps) => {
  return null;
};

export default SpinWheelRewardText;
