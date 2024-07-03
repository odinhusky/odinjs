import { CloseICON } from '../../../../components-bs/Icons/CloseICON';
import cx from '../../../../utils/cx';
import { LuckyWheelDetailModalProps } from '../..';
import { BaseModal } from '../../../BaseModal';
import t from 'apps/gambling/src/assets/constant/lang';
import useLuckyWheelLuckyValueDetailTransform from 'apps/gambling/src/app/external/transform/activity/luckyWheel/useLuckyWheelLuckyValueDetailTransform';
import {
  formatDenominatorValue,
  formatIntLocaleMoney,
} from '../../../../utils/format';

export const LuckyWheelDetailModalP1 = ({
  // isShow,
  onClose,
}: LuckyWheelDetailModalProps) => {
  const { luckyValueDetail } = useLuckyWheelLuckyValueDetailTransform();

  const spanLine = cx('block mt-3');

  const valueClass = cx('text-[var(--text-lucky-value)]');

  return (
    <BaseModal className={cx('p-4')} onClose={() => {}}>
      <div
        className={cx(
          'p-4 tab:px-6 tab:py-5',
          'w-full max-w-[482px]',
          'rounded-[16px]',
          'relative',
          'bg-modal'
        )}
      >
        <button
          className={cx('absolute top-[0px] right-[0px]')}
          onClick={() => {
            onClose();
          }}
        >
          <CloseICON outLined={false} />
        </button>

        <div
          className={cx(
            'text-lg leading-7',
            'tab:text-xl',
            'text-white font-medium'
          )}
        >
          {t['Details']}
        </div>

        <div
          className={cx(
            'mt-3',
            'pr-6',
            'font-medium text-white',
            'text-sm leading-5',
            'text-base leading-6'
          )}
        >
          <span className={cx(spanLine)}>
            {t['totalDamaText']}
            <span className={valueClass}>
              {' '}
              {t['moneyWithRSign'](
                formatDenominatorValue(luckyValueDetail?.totalDama || 0)
              )}
            </span>
          </span>
          <span className={cx(spanLine)}>
            {t['usedLuckyValueText']}{' '}
            <span className={valueClass}>
              {formatIntLocaleMoney(luckyValueDetail?.usedLuckyValue || 0)}
            </span>
          </span>
          <span className={cx(spanLine)}>
            {t['expiredLuckyValueText']}{' '}
            <span className={valueClass}>
              {formatIntLocaleMoney(luckyValueDetail?.expiredLuckyValue || 0)}
            </span>
          </span>
          <span className={cx(spanLine)}>
            {t['availableLuckyValueText']}{' '}
            <span className={valueClass}>
              {formatIntLocaleMoney(luckyValueDetail?.availableLuckyValue || 0)}
            </span>
          </span>
        </div>
      </div>
    </BaseModal>
  );
};

export default LuckyWheelDetailModalP1;
