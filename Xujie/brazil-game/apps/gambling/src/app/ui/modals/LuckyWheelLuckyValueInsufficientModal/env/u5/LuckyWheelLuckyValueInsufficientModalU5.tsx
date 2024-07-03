import cx from '../../../../utils/cx';
import { LuckyWheelLuckyValueInsufficientModalProps } from '../..';
import { BaseModal } from '../../../BaseModal';
import t from 'apps/gambling/src/assets/constant/lang';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';
import { environment } from 'apps/gambling/src/environments/environment';

export const LuckyWheelLuckyValueInsufficientModalU5 = ({
  isShow,
  onClose,
}: LuckyWheelLuckyValueInsufficientModalProps) => {
  return (
    <BaseModal
      className={cx('p-4', {
        hidden: !isShow,
      })}
      onClose={() => {}}
    >
      <div
        className={cx(
          'p-5 tab:p-8',
          'w-full max-w-[396px]',
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
            'text-xl leading-7',
            'tab:text-[24px] tab:leading-[32px]',
            'text-white font-extrabold'
          )}
        >
          {t['Tips']}
        </div>

        <div
          className={cx(
            'mt-3',
            'font-bold text-white',
            'text-base leading-6',
            'tab:text-lg leading-7'
          )}
        >
          <span className={cx('block')}>{t['luckyValueInsuffcirentHint']}</span>
        </div>

        <div className={cx('w-full', FLEX_CENTER, 'mt-3')}>
          <button
            className={cx(
              FLEX_CENTER,
              'bg-modal-btn',
              'rounded-[100px]',
              'w-full h-[40px] tab:h-[48px]',
              'font-medium text-white',
              'text-xl leading-7'
            )}
            onClick={onClose}
          >
            {t['Close']}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default LuckyWheelLuckyValueInsufficientModalU5;
