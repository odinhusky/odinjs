import cx from 'apps/gambling/src/app/ui/utils/cx';
import { LuckyWheelRewardAmountProps } from '../../components/LuckyWheelRewardAmount';
import { XY_CENTER } from 'apps/gambling/src/assets/constant/style';
import { formatDenominatorValue } from 'apps/gambling/src/app/ui/utils/format';

export const LuckyWheelRewardAmountU5 = ({
  showRewardAmount,
}: LuckyWheelRewardAmountProps) => {
  return (
    <div
      className={cx(
        'absolute z-5',
        XY_CENTER,
        'py-[10px] px-[12px]',
        'tab:py-[20px] tab:px-[32px]',
        'rounded-[20px]',
        'font-extrabold',
        'text-[24px] leading-[32px]',
        'tab:text-[36px] leading-[40px]',
        'reward-amount'
      )}
    >
      +{formatDenominatorValue(showRewardAmount)}
    </div>
  );
};

export default LuckyWheelRewardAmountU5;
