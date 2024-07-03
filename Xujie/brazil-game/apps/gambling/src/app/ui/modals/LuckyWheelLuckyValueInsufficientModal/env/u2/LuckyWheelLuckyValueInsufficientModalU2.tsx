import { CloseICON } from '../../../../components-bs/Icons/CloseICON';
import cx from '../../../../utils/cx';
import { LuckyWheelLuckyValueInsufficientModalProps } from '../..';
import { BaseModal } from '../../../BaseModal';
import t from 'apps/gambling/src/assets/constant/lang';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';

export const LuckyWheelLuckyValueInsufficientModalU2 = ({
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
          'px-4 tab:px-6',
          'pt-[60px]',
          'pb-5 tab:pb-8',
          'w-full max-w-[500px]',
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

        <div className={cx('text-xl leading-7', 'text-white font-medium')}>
          {t['Tips']}
        </div>

        <div
          className={cx(
            'mt-4 tab:mt-8',
            'font-medium text-white',
            'text-xl leading-7'
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
              'w-full h-[56px]',
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

export default LuckyWheelLuckyValueInsufficientModalU2;
