import cx from 'apps/gambling/src/app/ui/utils/cx';
import { LuckyWheelRewardAmountProps } from '../../components/LuckyWheelRewardAmount';
import { XY_CENTER } from 'apps/gambling/src/assets/constant/style';
import { formatDenominatorValue } from 'apps/gambling/src/app/ui/utils/format';

export const LuckyWheelRewardAmountU7 = ({
  showRewardAmount,
}: LuckyWheelRewardAmountProps) => {
  return (
    <div
      className={cx(
        'absolute z-5',
        XY_CENTER,
        'py-[8px] px-[12px]',
        'tab:py-[12px] tab:px-[16px]',
        'tablet::px-[20px]',
        'rounded-[12px]',
        'font-bold',
        'text-[20px] leading-[28px]',
        'tab:text-[30px] leading-[34px]',
        'reward-amount'
      )}
    >
      +{formatDenominatorValue(showRewardAmount)}
    </div>
  );
};

export default LuckyWheelRewardAmountU7;
