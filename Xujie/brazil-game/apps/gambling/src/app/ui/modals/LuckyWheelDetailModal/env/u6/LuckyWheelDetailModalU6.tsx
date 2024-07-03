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
import { environment } from 'apps/gambling/src/environments/environment';

export const LuckyWheelDetailModalU6 = ({
  // isShow,
  onClose,
}: LuckyWheelDetailModalProps) => {
  const { luckyValueDetail } = useLuckyWheelLuckyValueDetailTransform();

  const valueClass = cx('text-[var(--state-info-main)]');

  return (
    <BaseModal className={cx('p-4')} onClose={() => {}}>
      <div
        className={cx(
          'p-5',
          'w-full max-w-[460px]',
          'rounded-[12px]',
          'relative',
          'bg-modal'
        )}
      >
        <button
          className={cx(
            'w-[40px] h-[40px]',
            'rounded-full',
            'absolute right-[15px] top-[15px]',
            FLEX_CENTER
          )}
          onClick={() => {
            onClose();
          }}
        >
          <img
            className="w-[27px] h-[27px] hover:opacity-80"
            src={`assets/${environment.uVersion}/icon_close.png`}
            alt="close"
          />
        </button>

        <div
          className={cx(
            'font-bold tab:font-medium',
            'text-base leading-6',
            'tab:text-[20px] tab:leading-7',
            'text-white'
          )}
        >
          {t['Details']}
        </div>

        <div
          className={cx(
            'mt-4',
            'font-normal text-white',
            'text-xs leading-4',
            'text-base leading-6'
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

export default LuckyWheelDetailModalU6;
