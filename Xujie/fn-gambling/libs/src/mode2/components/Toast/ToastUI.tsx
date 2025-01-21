import { useBreakPoint } from '@libs/commonUtils';
import './index.scss';
import cx from '@libs/commonUtils/cx';
import React from 'react';
import { ToastItem } from '@mode2/components/Toast/index';

export const ToastUI = ({
  toasts,
  animMobileVisible,
}: {
  toasts: ToastItem[];
  animMobileVisible: boolean;
}) => {
  const { isMobile } = useBreakPoint();
  // 手機斷點 只拿最新一筆 toast message
  const message = isMobile ? toasts[toasts.length - 1]?.message : '';
  if (isMobile) {
    return message ? (
      <div className="fixed flex left-0 top-0 right-0 bottom-0 overflow-hidden justify-center items-center pointer-events-none z-50">
        <div
          className={cx(
            'absolute bgi-[var(--transparent-gray-70)] rounded-lg bgi-text-[var(--grayscale-100)] text-center',
            'w-[344px]',
            'py-2 px-4',
            animMobileVisible
              ? 'animate__animated animate__zoomIn animate__faster'
              : 'animate__animated animate__zoomOut animate__faster'
          )}
        >
          {message}
        </div>
      </div>
    ) : null;
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
};
