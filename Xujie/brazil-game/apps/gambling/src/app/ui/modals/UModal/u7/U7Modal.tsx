import { BaseModal } from '../../BaseModal';
import { ReactNode } from 'react';
import cx from '../../../utils/cx';
import { FLEX_CENTER, X_CENTER } from 'apps/gambling/src/assets/constant/style';
import U7BorderDiv from '../../../components/U7BorderDiv';
import PopupCloseBtn from '../../../components-bs/Buttons/PopupCloseBtn';

interface U7ModalProps {
  onClose: <T>(arg?: T) => void;
  children?: ReactNode;
  modalClass?: string;
  modalStyle?: React.CSSProperties;
  containerClass?: string;
  baseModalClass?: string;
  maxLayoutWidth?: string | number;
  isShowBorder?: boolean;
  isShowClose?: boolean;
}

export const U7Modal = ({
  onClose,
  children,
  baseModalClass,
  containerClass,
  modalClass,
  modalStyle = {},
  maxLayoutWidth = 400,
  isShowBorder = true,
  isShowClose = true,
}: U7ModalProps) => {
  return (
    <BaseModal className={cx('px-7', baseModalClass)} onClose={() => {}}>
      <div
        className={cx(
          `tab:max-w-[${maxLayoutWidth}px]`,
          'relative',
          containerClass
        )}
      >
        {/* <div
          className={cx(
            'absolute bottom-[-57.5px]',
            X_CENTER,
            'cursor-pointer',
            `${isShowClose ? '' : 'hidden'}`
          )}
          onClick={onClose}
        >
          <img
            src={`assets/u7/ic_closed.png`}
            className="w-[35px] h-[35px]"
            alt="close"
          />
        </div> */}

        <PopupCloseBtn
          className={cx(
            X_CENTER, 
            'absolute bottom-[-65.5px]',
            `${isShowClose ? '' : 'hidden'}`
          )}
          onClick={onClose}
        />

        <U7BorderDiv
          className={cx({
            'p-0 bg-[transparent]': isShowBorder === false,
          })}
        >
          <div
            className={cx(
              'bg-popup1',
              'relative',
              FLEX_CENTER,
              'flex-col gap-4',
              'text-[var(--grayscale-100)]',
              `w-full min-w-[180px] max-w-[${maxLayoutWidth}px]`,
              'rounded-[8px]',
              'p-5 tab:p-8',
              modalClass
            )}
            style={modalStyle}
          >
            {children}
          </div>
        </U7BorderDiv>
      </div>
    </BaseModal>
  );
};
