import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { RootState } from 'apps/gambling/src/app/reduxStore';
// = styles
import {
  FULL,
  FLEX_CENTER,
  MODAL_MASK,
  MODAL_FIX,
  MODAL_Z_INDEX,
  X_CENTER,
} from 'apps/gambling/src/assets/constant/style';
import cx from '../../../../utils/cx';
import { environment } from 'apps/gambling/src/environments/environment';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';

interface BoxModalU1Props {
  onClose: () => void;
  onConfirm: () => void;
  isOpen?: boolean;
}

export const BoxModalU1 = ({ onClose, onConfirm, isOpen }: BoxModalU1Props) => {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [bgLoad, setBgLoad] = useState(false);
  const [isCloseAnimation, setIsCloseAnimation] = useState(false);
  const { isDesktop } = useBreakpoint();
  const isLoading = useSelector(
    (state: RootState) => state.app.uILoading.isLoading
  );
  const screenHeight = window.innerHeight;

  const handleClose = () => {
    setIsCloseAnimation(true);
  };

  useEffect(() => {
    if (isCloseAnimation) {
      let timeout = setTimeout(() => {
        onClose();
      }, 600);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isCloseAnimation]);

  return (
    <div
      className={cx(
        FULL,
        FLEX_CENTER,
        MODAL_MASK,
        MODAL_FIX,
        MODAL_Z_INDEX,
        'px-5'
      )}
      onClick={() => {
        // handleClose();
      }}
    >
      <div
        className={cx(
          'w-full h-auto',
          'se:w-[344px] se:h-[auto]',
          'tab:w-[480px] tab:h-[548px]',
          'desk:w-[640px] desk:h-[732px]',
          'relative',
          {
            'desk:w-[480px] desk:h-[548px]': screenHeight <= 732,
          },
          'animate__animated animate__faster',
          {
            'opacity-0': !(isOpen && !isLoading && bgLoad),
            animate__backInDown: isOpen && !isLoading && bgLoad,
            animate__bounceOut: isCloseAnimation,
          }
        )}
      >
        <button
          className={cx(
            'w-[18px] h-[18px]',
            'tab:w-[39px] tab:h-[39px]',
            'desk:w-[67px] desk:h-[67px]',
            'absolute right-0 top-0'
          )}
          onClick={() => {
            handleClose();
          }}
        >
          <img
            className={cx(FULL)}
            src={`assets/${environment.uVersion}/icon_close_circle.png`}
            alt="Close modal image"
          />
        </button>

        {/* 背景圖 */}
        <img
          className={cx(FULL, 'hidden desk:block')}
          src={`assets/${environment.uVersion}/popup_event_treasures.png`}
          alt="Modal background image"
          onLoad={() => {
            setBgLoad(true);
          }}
        />

        <img
          className={cx(FULL, 'hidden tab:block desk:hidden')}
          src={`assets/${environment.uVersion}/popup_event_treasures_t.png`}
          alt="Modal background image"
          onLoad={() => {
            setBgLoad(true);
          }}
        />

        <img
          className={cx(FULL, 'tab:hidden')}
          src={`assets/${environment.uVersion}/popup_event_treasures_m.png`}
          alt="Modal background image"
          onLoad={() => {
            setBgLoad(true);
          }}
        />

        {/* 確認按鈕 */}
        <button
          className={cx(
            'w-[120px] h-[44px]',
            'tab:w-[164px] tab:h-[60px]',
            'desk:w-[220px] desk:h-[80px]',
            'absolute',
            X_CENTER,
            'bottom-[2%] tab:-bottom-[3%] desk:-bottom-[3%]'
          )}
          onMouseOver={() => {
            setHover(true);
          }}
          onMouseOut={() => {
            setHover(false);
          }}
          onMouseDown={() => {
            setActive(true);
          }}
          onMouseUp={() => {
            setActive(false);
          }}
          onTouchStart={() => {
            setActive(true);
          }}
          onTouchEnd={() => {
            setActive(false);
          }}
          onClick={() => {
            onConfirm();
          }}
        >
          <img
            className={cx(FULL)}
            src={`assets/${environment.uVersion}/btn_participate_default.png`}
            alt="Button Image"
          />

          <img
            className={cx(FULL, 'absolute inset-0 z-10 opacity-0', {
              'opacity-100': hover && !active && isDesktop,
            })}
            src={`assets/${environment.uVersion}/btn_participate_hover.png`}
            alt="Button Image"
          />

          <img
            className={cx(FULL, 'absolute inset-0 z-10 opacity-0', {
              'opacity-100': active && hover,
            })}
            src={`assets/${environment.uVersion}/btn_participate_active.png`}
            alt="Button Image"
          />
        </button>
      </div>
    </div>
  );
};

export default BoxModalU1;
