
import React, { useState } from "react";

// = styles
import { FULL, FLEX_CENTER, MODAL_MASK, MODAL_FIX, MODAL_Z_INDEX, X_CENTER } from "apps/gambling/src/assets/constant/style";
import cx from "../../../../utils/cx";
import { environment } from "apps/gambling/src/environments/environment";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";

interface BoxModalU5Props {
  onClose: () => void;
  onConfirm: () => void;
  isOpen?: boolean;
}

export const BoxModalU5 = ({onClose, onConfirm}: BoxModalU5Props) => {

  const [closeBtnHover, setCloseBtnHover] = useState(false);
  const [closeBtnActive, setCloseBtnActive] = useState(false);
  const [participateHover, setParticipateHover] = useState(false);
  const [participateActive, setParticipateActive] = useState(false);
  const { isDesktop } = useBreakpoint();
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
        'se:w-[293px] se:h-[auto]',
        'tab:w-[464px] tab:h-[399px]',
        'desk:w-[560px] desk:h-[483px]',
        'relative',
        {
          'desk:w-[480px] desk:h-[548px]': screenHeight <= 606
        }
      )}>
        {/* 右上角關閉按鈕 */}
        <button
          className={cx(
            'w-[40px] h-[40px]',
            'absolute -top-[8%] -right-[8%] tab:right-0 tab:top-0 ',
          )}
          onMouseOver={() => { setCloseBtnHover(true); }}
          onMouseOut={() => { setCloseBtnHover(false); }}
          onMouseDown={() => { setCloseBtnActive(true); }}
          onMouseUp={() => { setCloseBtnActive(false); }}
          onTouchStart={() => { setCloseBtnActive(true); }}
          onTouchEnd={() => { setCloseBtnActive(false); }}
          onClick={() => { onClose(); }}>
          <img
            className={cx(FULL)}
            src={`assets/${environment.uVersion}/btn_close_default_${environment.uVersion}.png`} alt="Button Image" />

          <img
            className={cx(FULL, 'absolute inset-0 z-10 opacity-0', {'opacity-100': closeBtnHover && !closeBtnActive && isDesktop })}
            src={`assets/${environment.uVersion}/btn_close_hover_${environment.uVersion}.png`} alt="Button Image" />

          <img
            className={cx(FULL, 'absolute inset-0 z-10 opacity-0', {'opacity-100': closeBtnActive && closeBtnHover})}
            src={`assets/${environment.uVersion}/btn_close_active_${environment.uVersion}.png`} alt="Button Image" />
        </button>
        
        {/* 背景圖 */}
        <img
          className={cx(FULL, 'hidden desk:block')}
          src={`assets/${environment.uVersion}/popup_event_treasures.png`}
          alt="Modal background image"
        />
        
        <img
          className={cx(FULL, 'hidden tab:block desk:hidden')}
          src={`assets/${environment.uVersion}/popup_event_treasures_t.png`}
          alt="Modal background image"
        />
        
        <img
          className={cx(FULL, 'tab:hidden')}
          src={`assets/${environment.uVersion}/popup_event_treasures_m.png`}
          alt="Modal background image"
        />
        {/* <div className={cx(FULL, 'bg-[black]', FLEX_CENTER, 'text-4xl', 'text-white', 'font-black')}>Not Yet Implement</div> */}

        {/* 確認按鈕 */}
        <button 
          className={cx(
            'w-[164px] h-[48px]',
            'tab:w-[219px] tab:h-[64px]',
            'desk:w-[260px] desk:h-[76px]',
            'absolute', X_CENTER, '-bottom-[24%] tab:-bottom-[20%]'
          )}
          onMouseOver={() => { setParticipateHover(true); }}
          onMouseOut={() => { setParticipateHover(false); }}
          onMouseDown={() => { setParticipateActive(true); }}
          onMouseUp={() => { setParticipateActive(false); }}
          onTouchStart={() => { setParticipateActive(true); }}
          onTouchEnd={() => { setParticipateActive(false); }}
          onClick={() => { onConfirm(); }}
        >
          <img
            className={cx(FULL)}
            src={`assets/${environment.uVersion}/btn_participate_default_${environment.uVersion}.png`} alt="Button Image" />

          <img
            className={cx(FULL, 'absolute inset-0 z-10 opacity-0', {'opacity-100': participateHover && !participateActive && isDesktop })}
            src={`assets/${environment.uVersion}/btn_participate_hover_${environment.uVersion}.png`} alt="Button Image" />

          <img
            className={cx(FULL, 'absolute inset-0 z-10 opacity-0', {'opacity-100': participateActive && participateHover})}
            src={`assets/${environment.uVersion}/btn_participate_active_${environment.uVersion}.png`} alt="Button Image" />
        </button>
      </div>
    </div>
  )
}

export default BoxModalU5;
