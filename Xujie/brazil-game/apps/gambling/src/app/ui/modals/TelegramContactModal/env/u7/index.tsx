import t from 'apps/gambling/src/assets/constant/lang';
import { U7Modal } from '../../../UModal/u7/U7Modal';
import cx from '../../../../utils/cx';
import U7OutlinedBtn from '../../../../components-bs/Buttons/env/u7/U7OutlinedBtn';

export type ITelegramContactModal = {
  close: () => void;
  toTelegramGroup: () => void;
};

export const TelegramContactModal = (props: ITelegramContactModal) => {
  // = style
  const fontClass = cx(
    'text-center',
    'text-base lading-5',
    'tab:text-lg tab:leading-6'
  );

  return (
    <U7Modal
      onClose={() => {
        props.close();
      }}
    >
      <div className={cx('relative flex flex-col')}>
        <div className={cx('font-bold', fontClass, 'mb-3 tab:mb-5')}>
          {t['ComeToJoinUs']}
        </div>

        <div className={cx(fontClass, 'mb-4 tab:mb-8')}>
          {t['telegramContactModalP1']}
          {t['telegramContactModalP2']}
          {t['telegramContactModalP3']}
        </div>

        <U7OutlinedBtn
          className={cx('text-sm tablet:text-base h-9 tablet:h-12 font-bold')}
          onClick={() => props.toTelegramGroup()}
        >
          {t['Join']}
        </U7OutlinedBtn>
      </div>
    </U7Modal>
  );
};
