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
          {t['Tips']}
        </div>

        <div
          className={cx(
            'mt-3',
            'pr-6',
            'font-medium text-white',
            'text-sm leading-5',
            'text-base leading-6',
            FLEX_CENTER
          )}
        >
          <span className={cx('block')}>{t['luckyValueInsuffcirentHint']}</span>
        </div>

        <div className={cx('w-full', FLEX_CENTER, 'mt-6')}>
          <button
            className={cx(
              FLEX_CENTER,
              'bg-modal-btn',
              'rounded-lg',
              'w-[228px] h-[35px]',
              'tab:w-[315px] h-[53px]',
              'tablet:w-[200px] tablet:h-[52px]',
              'font-medium text-white',
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
