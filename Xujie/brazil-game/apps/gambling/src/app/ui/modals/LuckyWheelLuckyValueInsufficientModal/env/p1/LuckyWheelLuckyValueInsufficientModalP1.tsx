import { CloseICON } from '../../../../components-bs/Icons/CloseICON';
import cx from '../../../../utils/cx';
import { LuckyWheelLuckyValueInsufficientModalProps } from '../..';
import { BaseModal } from '../../../BaseModal';
import t from 'apps/gambling/src/assets/constant/lang';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';

export const LuckyWheelLuckyValueInsufficientModalU1 = ({
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
          'p-4 tab:px-6 tab:py-5',
          'w-full max-w-[260px]',
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
          {t['Tips']}
        </div>

        <div
          className={cx(
            'mt-3',
            'pr-6',
            'font-normal text-white',
            'text-lg leading-7',
            'flex items-center'
          )}
        >
          <span className={cx('block')}>{t['luckyValueInsuffcirentHint']}</span>
        </div>

        <div className={cx('w-full', FLEX_CENTER, 'mt-3')}>
          <button
            className={cx(
              FLEX_CENTER,
              'bg-modal-btn',
              'rounded-lg',
              'w-full h-[42px]',
              'tab:w-[220px]',
              'font-bold text-[var(--text-button)]',
              'text-sm leading-5',
              'text-base leading-6'
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

export default LuckyWheelLuckyValueInsufficientModalU1;
