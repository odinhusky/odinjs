import t from 'apps/gambling/src/assets/constant/lang';
import cx from '../../utils/cx';
import { IButton, commonBtnClass } from './IButton';

export const LogoutConfirmButton = (props: IButton) => {
  return (
    <button
      className={cx(
        commonBtnClass,
        'bg-gradient-to-b from-[var(--primary-main-from)] to-[var(--primary-main-to)]'
      )}
      onClick={props.onClick}
    >
      {t['Confirm']}
    </button>
  );
};
