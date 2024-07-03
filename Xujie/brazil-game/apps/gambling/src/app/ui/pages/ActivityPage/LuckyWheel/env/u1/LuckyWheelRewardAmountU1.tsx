import cx from 'apps/gambling/src/app/ui/utils/cx';
import { LuckyWheelRewardAmountProps } from '../../components/LuckyWheelRewardAmount';
import { XY_CENTER } from 'apps/gambling/src/assets/constant/style';
import { formatDenominatorValue } from 'apps/gambling/src/app/ui/utils/format';

export const LuckyWheelRewardAmountU1 = ({
  showRewardAmount,
}: LuckyWheelRewardAmountProps) => {
  return (
    <div
      className={cx(
        'absolute z-5',
        XY_CENTER,
        'py-[9px] px-[18px]',
        'rounded-[22.5px]',
        'font-bold',
        'text-[40px] leading-[45px]',
        'tab:text-[54px] leading-[60px]',
        'reward-amount'
      )}
    >
      +{formatDenominatorValue(showRewardAmount)}
    </div>
  );
};

export default LuckyWheelRewardAmountU1;
