import cx from '../../../../utils/cx';
import { LuckyWheelLuckyValueInsufficientModalProps } from '../..';
import { BaseModal } from '../../../BaseModal';
import t from 'apps/gambling/src/assets/constant/lang';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';
import { environment } from 'apps/gambling/src/environments/environment';

export const LuckyWheelLuckyValueInsufficientModalU6 = ({
  isShow,
  onClose,
}: LuckyWheelLuckyValueInsufficientModalProps) => {
  return (
    <BaseModal
      className={cx('p-5 tab:py-[22px]', {
        hidden: !isShow,
      })}
      onClose={() => {}}
    >
      <div
        className={cx(
          'p-5',
          'w-full max-w-[276px]',
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
            'tablet:text-[20px] tablet:leading-7',
            'text-white text-center'
          )}
        >
          {t['Tips']}
        </div>

        <div
          className={cx(
            'mt-1',
            'font-medium text-center text-[var(--transparente-70)]',
            'text-sm leading-5',
            'tab:text-base tab:leading-6'
          )}
        >
          <span className={cx('block')}>{t['luckyValueInsuffcirentHint']}</span>
        </div>

        <div className={cx('w-full', FLEX_CENTER, 'mt-5')}>
          <button
            className={cx(
              FLEX_CENTER,
              'bg-modal-btn',
              'rounded-lg',
              'w-full h-[36px]',
              'text-white',
              'text-sm leading-5',
              'tablet:text-base leading-6',
              'font-bold tablet:font-medium'
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

export default LuckyWheelLuckyValueInsufficientModalU6;
