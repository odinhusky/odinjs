import cx from '../../../../utils/cx';
import { LuckyWheelDetailModalProps } from '../..';
import t from 'apps/gambling/src/assets/constant/lang';
import useLuckyWheelLuckyValueDetailTransform from 'apps/gambling/src/app/external/transform/activity/luckyWheel/useLuckyWheelLuckyValueDetailTransform';
import {
  formatDenominatorValue,
  formatIntLocaleMoney,
} from '../../../../utils/format';
import { U7Modal } from '../../../UModal/u7/U7Modal';
import {
  FLEX_COL,
  U7_MODAL_TITLE_FONT,
} from 'apps/gambling/src/assets/constant/style';

export const LuckyWheelDetailModalU7 = ({
  // isShow,
  onClose,
}: LuckyWheelDetailModalProps) => {
  const { luckyValueDetail } = useLuckyWheelLuckyValueDetailTransform();

  // = styles
  const valueClass = cx('text-[var(--grayscale)]');
  const valueLineClass = cx('block');

  return (
    <U7Modal onClose={onClose}>
      <div>
        <div className={cx(U7_MODAL_TITLE_FONT, 'text-center')}>
          {t['Details']}
        </div>

        <div
          className={cx(
            'mt-4',
            'font-normal text-white',
            'text-xs leading-4',
            'text-base leading-6',
            FLEX_COL,
            'gap-3 tab:gap-5'
          )}
        >
          <span className={cx(valueLineClass)}>
            {t['totalDamaText']}
            <span className={valueClass}>
              {' '}
              {t['moneyWithRSign'](
                formatDenominatorValue(luckyValueDetail?.totalDama || 0)
              )}
            </span>
          </span>

          <span className={cx(valueLineClass)}>
            {t['usedLuckyValueText']}{' '}
            <span className={valueClass}>
              {formatIntLocaleMoney(luckyValueDetail?.usedLuckyValue || 0)}
            </span>
          </span>
          <span className={cx(valueLineClass)}>
            {t['expiredLuckyValueText']}{' '}
            <span className={valueClass}>
              {formatIntLocaleMoney(luckyValueDetail?.expiredLuckyValue || 0)}
            </span>
          </span>
          <span className={cx(valueLineClass)}>
            {t['availableLuckyValueText']}{' '}
            <span className={valueClass}>
              {formatIntLocaleMoney(luckyValueDetail?.availableLuckyValue || 0)}
            </span>
          </span>
        </div>
      </div>
    </U7Modal>
  );
};

export default LuckyWheelDetailModalU7;
