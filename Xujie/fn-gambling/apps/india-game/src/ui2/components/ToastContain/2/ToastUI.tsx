import { useBreakPoint } from '@libs/commonUtils';
import cx from '@libs/commonUtils/cx';
import React, { memo, useEffect } from 'react';
import { ToastItem } from './index';
import { Toast } from 'antd-mobile';
import { TOAST_DURATION_TIMEOUT } from '@libs/constant/toast';

export const ToastUI = memo(
  ({
    toasts,
    mobileToastMsg,
    mobileCallbackFn,
  }: {
    toasts: ToastItem[];
    mobileToastMsg: string;
    mobileCallbackFn?: VoidFunction;
  }) => {
    const { isMobile } = useBreakPoint();

    // 手機斷點 只拿最新一筆 toast message
    useEffect(() => {
      if (isMobile && mobileToastMsg) {
        Toast.show({
          maskClassName: '!z-[1100]',
          content: mobileToastMsg,
          duration: TOAST_DURATION_TIMEOUT,
          afterClose: () => {
            // console.log('!! AFTER mobileToastMsg ===>', mobileToastMsg);
            mobileCallbackFn?.();
          },
        });
      }
    }, [isMobile, mobileToastMsg]);

    if (isMobile) {
      return <></>;
    } else {
      return (
        <div className="fixed top-0 right-0 flex flex-col tablet:gap-4 gap-5 mt-10 mr-10 pointer-events-none z-50">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={cx(
                'bgi-[var(--transparent-gray-70)] rounded-lg bgi-text-[var(--grayscale-100)] text-center',
                'tablet:w-[321px] mobile:w-[240px] w-auto',
                'py-2 px-4',
                toast.visible
                  ? 'animate__animated animate__slideInRight animate__faster'
                  : 'animate__animated animate__fadeOutRight animate__faster'
              )}
            >
              {toast.message}
            </div>
          ))}
        </div>
      );
    }
  }
);
