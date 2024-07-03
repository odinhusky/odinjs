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

export const LuckyWheelDetailModalU1 = ({
  // isShow,
  onClose,
}: LuckyWheelDetailModalProps) => {
  const { luckyValueDetail } = useLuckyWheelLuckyValueDetailTransform();

  return (
    <BaseModal className={cx('p-4')} onClose={() => {}}>
      <div
        className={cx(
          'p-4 tab:px-8 tab:py-7',
          'w-full max-w-[482px]',
          'rounded-[24px]',
          'border-2 border-[var(--stroke-modal)]',
          'relative',
          'bg-modal'
        )}
      >
        <button
          className={cx('absolute top-[18px] right-[18px]')}
          onClick={() => {
            onClose();
          }}
        >
          <CloseICON outLined={false} />
        </button>

        <div
          className={cx(
            'text-base leading-6',
            'tab:text-xl tab:leading-7',
            'text-white text-center font-bold'
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
          <span className={cx('block mb-3')}>
            {t['totalDamaText']}{' '}
            {t['moneyWithRSign'](
              formatDenominatorValue(luckyValueDetail?.totalDama || 0)
            )}
          </span>
          <span className={cx('block mb-3')}>
            {t['usedLuckyValueText']}{' '}
            {formatIntLocaleMoney(luckyValueDetail?.usedLuckyValue || 0)}
          </span>
          <span className={cx('block mb-3')}>
            {t['expiredLuckyValueText']}{' '}
            {formatIntLocaleMoney(luckyValueDetail?.expiredLuckyValue || 0)}
          </span>
          <span className={cx('block mb-3')}>
            {t['availableLuckyValueText']}{' '}
            {formatIntLocaleMoney(luckyValueDetail?.availableLuckyValue || 0)}
          </span>
        </div>
      </div>
    </BaseModal>
  );
};

export default LuckyWheelDetailModalU1;
