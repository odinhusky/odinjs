import cx from '../../../../utils/cx';
import { LuckyWheelLuckyValueInsufficientModalProps } from '../..';
import t from 'apps/gambling/src/assets/constant/lang';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';
import { U7Modal } from '../../../UModal/u7/U7Modal';
import U7OutlinedBtn from '../../../../components-bs/Buttons/env/u7/U7OutlinedBtn';

export const LuckyWheelLuckyValueInsufficientModalU7 = ({
  isShow,
  onClose,
}: LuckyWheelLuckyValueInsufficientModalProps) => {
  const fontClass = cx(
    'font-bole text-[var(--grayscale-100)] text-center',
    'text-lg leading-6'
  );

  return (
    <U7Modal
      baseModalClass={cx({
        hidden: !isShow,
      })}
      containerClass={cx('max-w-[296px]')}
      onClose={onClose}
    >
      <div className={cx('w-full', 'relative')}>
        <div className={cx(fontClass)}>{t['Tips']}</div>

        <div className={cx('mt-5', fontClass)}>
          <span className={cx('block')}>{t['luckyValueInsuffcirentHint']}</span>
        </div>

        <div className={cx('w-full', FLEX_CENTER, 'mt-5')}>
          <U7OutlinedBtn onClick={onClose}>{t['Close']}</U7OutlinedBtn>
        </div>
      </div>
    </U7Modal>
  );
};

export default LuckyWheelLuckyValueInsufficientModalU7;
