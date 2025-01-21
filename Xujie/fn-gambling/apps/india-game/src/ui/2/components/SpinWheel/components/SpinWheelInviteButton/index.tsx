import { cx } from '@libs/commonUtils';
import { FLEX_COL } from '@libs/constant/style';
import { useTranslation } from 'react-i18next';

interface SpinWheelInviteButtonProps {
  isFreeSpin?: boolean;
  remainSpin: number;
  buttonSpinClass?: string;
  buttonTextClass?: string;
}

export const SpinWheelInviteButton = ({
  isFreeSpin,
  remainSpin,
  buttonSpinClass,
  buttonTextClass,
}: SpinWheelInviteButtonProps) => {
  const { t } = useTranslation();

  const i18nKey = isFreeSpin
    ? 'spin_and_share_wheel_free_spin'
    : 'spin_and_share_wheel_spin';
  return (
    <div
      className={cx(
        FLEX_COL,
        'text-center',
        'bgi-text-[var(--grayscale-100)]',
        'font-semibold',
        'mb-3'
      )}
    >
      <span
        className={cx(
          'block',
          'text-base se:text-base mobile:text-lg',
          buttonSpinClass
        )}
      >
        x{remainSpin}
      </span>
      <span
        className={cx(
          'block',
          'text-xxxs se:text-xxxs mobile:text-xxs',
          buttonTextClass
        )}
      >
        {t(i18nKey)}
      </span>
    </div>
  );
};

export default SpinWheelInviteButton;
