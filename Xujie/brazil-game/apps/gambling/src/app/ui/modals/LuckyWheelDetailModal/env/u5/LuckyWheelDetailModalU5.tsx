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

export const LuckyWheelDetailModalU5 = ({
  // isShow,
  onClose,
}: LuckyWheelDetailModalProps) => {
  const { luckyValueDetail } = useLuckyWheelLuckyValueDetailTransform();

  const valueClass = cx('text-white');

  return (
    <BaseModal className={cx('p-4')} onClose={() => {}}>
      <div
        className={cx(
          'p-5 tab:p-8',
          'w-full max-w-[464px]',
          'rounded-[20px]',
          'relative',
          'bg-modal'
        )}
      >
        <button
          className={cx(
            'w-[40px] h-[40px]',
            'rounded-full',
            'absolute -right-2.5 -top-2.5',
            FLEX_CENTER,
            'bg-linear-6-main shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)]'
          )}
          onClick={() => {
            onClose();
          }}
        >
          <img
            className="w-[24px] h-[24px] hover:opacity-80"
            src={`assets/${environment.uVersion}/icon_close.png`}
            alt="close"
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
            'mt-3',
            'font-bold text-white',
            'text-sm leading-4',
            'text-lg leading-7'
          )}
        >
          <span className={cx('block mb-3')}>
            {t['totalDamaText']}
            <span>
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

export default LuckyWheelDetailModalU5;
