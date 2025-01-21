import { WheelCategory } from '@components/SpinWheel';
import { cx } from '@libs/commonUtils';
import { formatMoney } from '@libs/mode2/utils';

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
  const titleClass = cx(
    ...wheelRewardTextStyleProps.className,
    'block',
    rewardTitleClass
  );
  return (
    <div
      className={cx(
        rouletteClass,
        'absolute',
        {
          'top-[7%] left-[18%]': isMoneyAsReward && category === 'recharge',
          'top-[7%] left-[17%]': !isMoneyAsReward && category === 'recharge',
          'top-[4.8%] left-[11.5%]': isMoneyAsReward && category === 'invite',
          'top-[5%] left-[11%]': !isMoneyAsReward && category === 'invite',
        },
        'bgi-text-[var(--grayscale-100)]',
        'font-semibold text-center',
        'text-sm',
        {
          'text-sm': category === 'recharge',
          'text-base': category === 'invite',
        },
        'rotate-[-72deg]',
        'pl-[25px]'
      )}
      style={{
        textShadow: 'var(--text-shadow-gray-70)',
      }}
    >
      {isMoneyAsReward ? (
        formatMoney(value as number)
      ) : category === 'recharge' ? (
        <div>
          <span {...wheelRewardTextStyleProps} className={titleClass}>
            {rewardWheelType}
          </span>
          <span {...wheelRewardTextStyleProps} className={titleClass}>
            Spin x{value}
          </span>
        </div>
      ) : Array.isArray(value) ? (
        <span {...wheelRewardTextStyleProps} className={titleClass}>
          {value.length > 1
            ? `${formatMoney(value[0])}~${formatMoney(value[1])}`
            : formatMoney(value[0])}
        </span>
      ) : (
        <span {...wheelRewardTextStyleProps} className={titleClass}>
          {value}
        </span>
      )}
    </div>
  );
};

export default SpinWheelRewardText;
