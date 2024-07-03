import { CloseICON } from '../../../../components-bs/Icons/CloseICON';
import cx from '../../../../utils/cx';
import { LuckyWheelDetailModalProps } from '../..';
import { BaseModal } from '../../../BaseModal';
import t from 'apps/gambling/src/assets/constant/lang';
import useLuckyWheelLuckyValueDetailTransform from 'apps/gambling/src/app/external/transform/activity/luckyWheel/useLuckyWheelLuckyValueDetailTransform';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';
import {
  formatDenominatorValue,
  formatIntLocaleMoney,
} from '../../../../utils/format';

export const LuckyWheelDetailModalU2 = ({
  // isShow,
  onClose,
}: LuckyWheelDetailModalProps) => {
  const { luckyValueDetail } = useLuckyWheelLuckyValueDetailTransform();

  const valueClass = cx('text-[var(--state-warn-main)]');

  return (
    <BaseModal className={cx('p-4')} onClose={() => {}}>
      <div
        className={cx(
          'px-4 tab:px-6',
          'pt-[60px]',
          'pb-5 tab:pb-8',
          'w-full max-w-[482px]',
          'rounded-[16px]',
          'relative',
          'bg-modal'
        )}
      >
        <button
          className={cx(
            'w-[40px] h-[40px]',
            'absolute top-[20px] right-[24px]',
            FLEX_CENTER
          )}
          onClick={() => {
            onClose();
          }}
        >
          <CloseICON
            btnClassName={cx('w-[30px] h-[30px]', FLEX_CENTER)}
            outLined={true}
          />
        </button>

        <div
          className={cx(
            'text-lg leading-7',
            'tab:text-xl',
            'text-white text-left font-bold'
          )}
        >
          {t['Details']}
        </div>

        <div
          className={cx(
            'mt-4 tab:mt-8',
            'font-medium text-white',
            'text-sm leading-4',
            'text-lg leading-7'
          )}
        >
          <span className={cx('block mb-3')}>
            {t['totalDamaText']}
            <span className={valueClass}>
              {' '}
              {t['moneyWithRSign'](
                formatDenominatorValue(luckyValueDetail?.totalDama || 0)
              )}
            </span>
          </span>
          <span className={cx('block mb-3')}>
            {t['usedLuckyValueText']}{' '}
            <span className={valueClass}>
              {formatIntLocaleMoney(luckyValueDetail?.usedLuckyValue || 0)}
            </span>
          </span>
          <span className={cx('block mb-3')}>
            {t['expiredLuckyValueText']}{' '}
            <span className={valueClass}>
              {formatIntLocaleMoney(luckyValueDetail?.expiredLuckyValue || 0)}
            </span>
          </span>
          <span className={cx('block mb-3')}>
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

export default LuckyWheelDetailModalU2;
