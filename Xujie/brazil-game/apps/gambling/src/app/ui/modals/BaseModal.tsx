import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';
import cx from '../utils/cx';

type IBaseModal = {
  className?: string;
  children?: React.ReactElement;
  onClose?: (event: any) => void;
};
export const BaseModal = (props: IBaseModal) => {
  return (
    <div
      className={cx(
        'z-[1005] fixed inset-0',
        FLEX_CENTER,
        'flex-col',
        'bg-[rgba(0,0,0,0.65)]',
        props.className
      )}
      onClick={props.onClose}
    >
      {props.children}
    </div>
  );
};
