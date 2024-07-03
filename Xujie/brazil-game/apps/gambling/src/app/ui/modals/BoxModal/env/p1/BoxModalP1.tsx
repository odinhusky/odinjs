// = styles
import { FULL, FLEX_CENTER, MODAL_MASK, MODAL_FIX, MODAL_Z_INDEX, X_CENTER } from "apps/gambling/src/assets/constant/style";
import cx from "../../../../utils/cx";
import { environment } from "apps/gambling/src/environments/environment";

interface BoxModalP1Props {
  onClose: () => void;
  onConfirm: () => void;
  isOpen?: boolean;
}

export const BoxModalP1 = ({onClose, onConfirm}: BoxModalP1Props) => {
  const screenHeight = window.innerHeight;

  return (
    <div
      className={cx(FULL, FLEX_CENTER, MODAL_MASK, MODAL_FIX, MODAL_Z_INDEX, 'px-5')}
      onClick={() => {
        // onClose();
      }}
    >
      <div className={cx(
        'w-full h-auto',
        'se:w-[344px] se:h-[auto]',
        'tab:w-[480px] tab:h-[548px]',
        'desk:w-[640px] desk:h-[732px]',
        'relative',
        {
          'desk:w-[480px] desk:h-[548px]': screenHeight <= 732
        }
      )}>
        <button
          className={cx(
            'w-[24px] h-[24px]',
            'absolute right-0 top-0'
          )}
          onClick={() => { onClose(); }}>
          <img
            className={cx(FULL)}
            src={`assets/${environment.uVersion}/icon_close.png`} alt="Close modal image" />
        </button>
        
        {/* 背景圖 */}
        {/* <img
          className={cx(FULL)}
          src={`assets/${environment.uVersion}/bg_box_modal.png`}
          alt="Modal background image" /> */}
        <div className={cx(FULL, 'bg-[black]', FLEX_CENTER, 'text-4xl', 'text-white', 'font-black')}>Not Yet Implement</div>

        {/* 確認按鈕 */}
        {/* <button 
          className={cx(
            'w-[138px] h-[40px]',
            'desk:w-[182px] desk:h-[65px]',
            FLEX_CENTER,
            'absolute', X_CENTER, 'bottom-[4%] tab:bottom-[9%] desk:bottom-[4%]',
            'text-base leading-5 font-bold',
            'desk:text-2xl desk:leading-7',
            'text-[var(--main-primary-varient)]',
            'bg-gradient-to-b from-[var(--btn-gradient1-from)] to-[var(--btn-gradient1-to)]',
            'rounded-[40px]',
          )}
          onClick={() => { onConfirm(); }}
        >
          PARTICIPE
        </button> */}
      </div>
    </div>
  )
}

export default BoxModalP1;
