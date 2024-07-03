import { ILeaveGameConfirmModalProps } from '../../index';
import { CheckBox } from '../../../../components/CheckBox';
import { useState } from 'react';
import { U7Modal } from '../../../UModal/u7/U7Modal';
import t from 'apps/gambling/src/assets/constant/lang';
import cx from '../../../../utils/cx';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';
import U7OutlinedBtn from '../../../../components-bs/Buttons/env/u7/U7OutlinedBtn';
import U7Linear2Btn from '../../../../components-bs/Buttons/env/u7/U7Linear2Btn';

export const U7LeaveGameConfirmModal = ({
  onConfirm,
  onClose,
}: ILeaveGameConfirmModalProps) => {
  const [addFavorite, setAddFavorite] = useState(false);

  const fontClass1 = cx('text-center', 'text-white', 'text-lg leading-6');

  return (
    <U7Modal onClose={onClose}>
      <div
        className={cx(
          'rounded-xl',
          'box-border',
          'flex flex-col gap-5 tab:gap-8'
        )}
      >
        <div className="w-full space-y-4">
          <div className={cx('font-bold', fontClass1)}>{t['Leave']}</div>

          <div className={cx('font-normal', fontClass1)}>
            {t['makeSureLeaveGame']}
          </div>

          <div
            className={cx(
              'w-full',
              'p-2 tablet:p-3',
              FLEX_CENTER,
              'box-border',
              'rounded-lg',
              "rounded-lg p-3 bg-[var(--transparent-black-10)]"
            )}
          >
            <CheckBox
              className={cx('w-6 h-6', 'mr-3')}
              checked={addFavorite}
              onClick={() => setAddFavorite(!addFavorite)}
            />

            <div
              className={cx(
                'text-[var(--transparent-white-80)]',
                'font-medium',
                'font-base leading-5',
              )}
            >
              {t['addThisGameToCollection']}
            </div>
          </div>

          <div
            className={cx(
              'w-full',
              'flex items-center gap-5',
              'text-sm tablet:text-base font-bold tablet:font-medium'
            )}
          >
            <U7Linear2Btn onClick={onClose}>{t['Cancel']}</U7Linear2Btn>

            <U7OutlinedBtn
              onClick={() => {
                onConfirm(addFavorite);
              }}
            >
              {t['Confirm']}
            </U7OutlinedBtn>
          </div>
        </div>
      </div>
    </U7Modal>
  );
};

export default U7LeaveGameConfirmModal;
