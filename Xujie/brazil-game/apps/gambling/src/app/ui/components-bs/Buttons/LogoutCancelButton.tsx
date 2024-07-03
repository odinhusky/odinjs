import t from 'apps/gambling/src/assets/constant/lang';
import cx from '../../utils/cx';
import { IButton, commonBtnClass } from './IButton';

export const LogoutCancelButton = (props: IButton) => {
  return (
    <button
      className={cx(
        commonBtnClass,
        'bg-gradient-to-b from-[var(--secondary-main-from)] to-[var(--secondary-main-to)]'
      )}
      onClick={props.onClick}
    >
      {t['Cancel']}
    </button>
  );
};
