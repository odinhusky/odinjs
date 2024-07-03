import { ITelegramDetailContactModalProps } from '../../index';
import { U7Modal } from '../../../UModal/u7/U7Modal';
import cx from '../../../../utils/cx';
import U7OutlinedBtn from '../../../../components-bs/Buttons/env/u7/U7OutlinedBtn';
import t from 'apps/gambling/src/assets/constant/lang';

export const U7TelegramDetailContactModal = ({
  onClickToOpenTelegramService,
  onClickToOpenTelegramManager,
  onClose,
}: ITelegramDetailContactModalProps) => {
  const fontClass = cx(
    'font-medium text-center',
    'text-sm leading-[18px]',
    'tab:text-base tab:leading-5'
  );

  return (
    <U7Modal onClose={onClose}>
      <div
        className={cx(
          'relative',
          'flex flex-col gap-4 tablet:gap-8',
          'font-medium text-[var(--grayscale-100)]',
          'rounded-xl'
        )}
      >
        <div className={cx('flex flex-col gap-6', 'rounded-xl')}>
          <div className={cx('flex flex-col gap-3')}>
            <div className={cx('text-white', fontClass)}>
              {t['ifUNeedHelpContactClient']}
            </div>

            <U7OutlinedBtn
              borderClass={cx('mt-3')}
              onClick={onClickToOpenTelegramService}
            >
              {t['customerService']}
            </U7OutlinedBtn>
          </div>

          <div className={cx('divider-important')}></div>

          <div className={cx('flex flex-col gap-3')}>
            <div className={cx('text-important', fontClass, 'font-semibold')}>
              {t['businessRelatedContactManager']}
            </div>

            <U7OutlinedBtn
              borderClass={cx('mt-3')}
              onClick={onClickToOpenTelegramManager}
            >
              {t['managerTelegram']}
            </U7OutlinedBtn>
          </div>
        </div>
      </div>

      <p
        className={cx(
          'block',
          'mt-8',
          'text-[var(--grayscale-100)]',
          fontClass
        )}
      >
        {t['clickToSkip']}
      </p>
    </U7Modal>
  );
};

export default U7TelegramDetailContactModal;
