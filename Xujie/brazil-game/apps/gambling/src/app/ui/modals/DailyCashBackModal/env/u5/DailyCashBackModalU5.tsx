
import React, { useState } from "react";

// = styles
import { FULL, FLEX_CENTER, MODAL_MASK, MODAL_FIX, MODAL_Z_INDEX, X_CENTER } from "apps/gambling/src/assets/constant/style";
import cx from "../../../../utils/cx";
import { environment } from "apps/gambling/src/environments/environment";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";

interface DailyCashBackModalU5Props {
  onClose: () => void;
  onConfirm: () => void;
  isOpen?: boolean;
}

export const DailyCashBackModalU5 = ({onClose, onConfirm}: DailyCashBackModalU5Props) => {

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
        'se:w-[344px] se:h-[auto]',
        'tab:w-[541px] tab:h-[500px]',
        'desk:w-[657px] desk:h-[606px]',
        'relative',
        {
          'desk:w-[480px] desk:h-[548px]': screenHeight <= 606
        }
      )}>
        {/* 右上角關閉按鈕 */}
        <button
          className={cx(
            'w-[40px] h-[40px]',
            'absolute right-0 top-0',
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
          src={`assets/${environment.uVersion}/popup_event_daily_rebate.png`}
          alt="Modal background image"
        />
        
        <img
          className={cx(FULL, 'hidden tab:block desk:hidden')}
          src={`assets/${environment.uVersion}/popup_event_daily_rebate_t.png`}
          alt="Modal background image"
        />
        
        <img
          className={cx(FULL, 'tab:hidden')}
          src={`assets/${environment.uVersion}/popup_event_daily_rebate_m.png`}
          alt="Modal background image"
        />

        {/* 確認按鈕 */}
        <button 
          className={cx(
            'w-[164px] h-[48px]',
            'tab:w-[219px] tab:h-[64px]',
            'desk:w-[260px] desk:h-[76px]',
            'absolute', X_CENTER, 'bottom-[4%] tab:-bottom-[6%]'
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

export default DailyCashBackModalU5;
