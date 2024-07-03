// = styles
import { FULL, FLEX_CENTER, MODAL_MASK, MODAL_FIX, MODAL_Z_INDEX, X_CENTER } from "apps/gambling/src/assets/constant/style";
import cx from "../../../../utils/cx";
import { environment } from "apps/gambling/src/environments/environment";

interface LossReliefModalP1Props {
  onClose: () => void;
  onConfirm: () => void;
  isOpen?: boolean;
}

export const LossReliefModalP1 = ({onClose, onConfirm}: LossReliefModalP1Props) => {
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
        <img
          className={cx(FULL, 'hidden desk:block')}
          src={`assets/${environment.uVersion}/popup_event_loss_refund.png`}
          alt="Modal background image"
        />
        
        <img
          className={cx(FULL, 'hidden tab:block desk:hidden')}
          src={`assets/${environment.uVersion}/popup_event_loss_refund_t.png`}
          alt="Modal background image"
        />
        
        <img
          className={cx(FULL, 'tab:hidden')}
          src={`assets/${environment.uVersion}/popup_event_loss_refund_m.png`}
          alt="Modal background image"
        />

        {/* 確認按鈕 */}
        <button 
          className={cx(
            'w-[138px] h-[40px]',
            'desk:w-[182px] desk:h-[65px]',
            FLEX_CENTER,
            'absolute', X_CENTER, 'bottom-[4%] tab:bottom-[9%] desk:bottom-[5%]',
            'text-base leading-5 font-bold',
            'desk:text-2xl desk:leading-7',
            'text-[var(--main-primary-varient)]',
            'bg-gradient-to-b from-[var(--btn-gradient1-from)] to-[var(--btn-gradient1-to)]',
            'rounded-[40px]',
          )}
          onClick={() => { onConfirm(); }}
        >
          PARTICIPE
        </button>
      </div>
    </div>
  )
}

export default LossReliefModalP1;
