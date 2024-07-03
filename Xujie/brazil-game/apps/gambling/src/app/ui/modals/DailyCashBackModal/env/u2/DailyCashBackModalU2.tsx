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
import 'animate.css';

interface DailyCashBackModalU2Props {
  onClose: () => void;
  onConfirm: () => void;
  isOpen?: boolean;
}

export const DailyCashBackModalU2 = ({
  onClose,
  onConfirm,
  isOpen,
}: DailyCashBackModalU2Props) => {
  const screenHeight = window.innerHeight;
  const [bgLoad, setBgLoad] = useState(false);
  const [isCloseAnimation, setIsCloseAnimation] = useState(false);
  const isLoading = useSelector(
    (state: RootState) => state.app.uILoading.isLoading
  );

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
        // handleClose()
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
          src={`assets/${environment.uVersion}/popup_event_daily_rebate.png`}
          alt="Modal background image"
          onLoad={() => {
            setBgLoad(true);
          }}
        />

        <img
          className={cx(FULL, 'hidden tab:block desk:hidden')}
          src={`assets/${environment.uVersion}/popup_event_daily_rebate_t.png`}
          alt="Modal background image"
          onLoad={() => {
            setBgLoad(true);
          }}
        />

        <img
          className={cx(FULL, 'tab:hidden')}
          src={`assets/${environment.uVersion}/popup_event_daily_rebate_m.png`}
          alt="Modal background image"
          onLoad={() => {
            setBgLoad(true);
          }}
        />

        <button
          className={cx(
            'w-[140px] h-[40px]',
            'tab:w-[149px] tab:h-[48px]',
            'desk:w-[166px] desk:h-[56px]',
            'absolute',
            X_CENTER,
            'bottom-[11%] tab:bottom-[10%] desk:bottom-[10%]',
            FLEX_CENTER,
            'text-sm leading-5',
            'tab:text-base tab:leading-6',
            'desk:text-xl desk:leading-7',
            'text-[var(--grayscale-100)]',
            'bg-[var(--primary-main)] hover:bg-[var(--primary-hover)] active:bg-[var(--primary-dark-active)]',
            'rounded-lg',
            'shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]'
          )}
          onClick={() => {
            onConfirm();
          }}
        >
          Participe
        </button>
      </div>
    </div>
  );
};

export default DailyCashBackModalU2;
