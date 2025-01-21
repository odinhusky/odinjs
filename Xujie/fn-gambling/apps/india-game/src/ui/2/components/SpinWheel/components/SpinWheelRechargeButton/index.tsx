import { cx } from '@libs/commonUtils';
import { FLEX_COL } from '@libs/constant/style';
import { RechargeWheelType } from '@libs/mode2/zustand/components/rechargeWheelTabStore';
import { capitalize } from 'lodash';

interface SpinWheelRechargeButtonProps {
  remainSpin: number;
  buttonType: RechargeWheelType;
}

export const SpinWheelRechargeButton = ({
  buttonType,
  remainSpin,
}: SpinWheelRechargeButtonProps) => {
  return (
    <div
      className={cx(
        FLEX_COL,
        'text-center',
        'bgi-text-[var(--grayscale-100)]',
        'font-semibold'
      )}
    >
      <span
        className={cx('block', 'text-xs')}
        style={{
          textShadow: 'var(--text-shadow-gray-70)',
        }}
      >
        {capitalize(buttonType)}
      </span>

      {/* // TODO I18N */}
      <span
        className={cx('block', 'text-sm')}
        style={{
          textShadow: 'var(--text-shadow-gray-70)',
        }}
      >
        Spin x{remainSpin}
      </span>
    </div>
  );
};

export default SpinWheelRechargeButton;
