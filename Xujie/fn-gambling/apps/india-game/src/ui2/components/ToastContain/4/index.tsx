import { forwardRef, useEffect, useState } from 'react';
import {
  ToastResult,
  useToastStore,
} from '@libs/mode2/zustand/components/toastStore';
import { v4 as uuidv4 } from 'uuid';
import './index.scss';
import { createPortal } from 'react-dom';
import cx from '@commonUtils/cx';
import { TOAST_HIDE_TIMEOUT, TOAST_REMOVE_TIMEOUT } from '@constant/toast';

export interface ToastItem extends ToastResult {
  id: string;
}

export const ToastContain = forwardRef(() => {
  const toastResult = useToastStore((state) => state.toastResult);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    if (!toastResult.message) return;
    const id = toastResult.id ?? uuidv4();
    setToasts((prev) => [...prev, { ...toastResult, id }]);
  }, [toastResult]);

  const handleRemove = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return createPortal(
    <div
      className={cx(
        'fixed left-0 z-[1200] top-[320px] w-full flex items-center justify-center pointer-events-none'
      )}
    >
      {toasts.map((toast) => (
        <ToastItemComponent
          key={toast.id}
          toast={toast}
          onDone={handleRemove}
        />
      ))}
    </div>,
    document.body
  );
});

export default ToastContain;

const ToastItemComponent = ({
  toast,
  onDone,
}: {
  toast: ToastItem;
  onDone: (id: string) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 0); // 避免初始沒有 transition

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, TOAST_HIDE_TIMEOUT);

    const cleanupTimer = setTimeout(() => {
      toast.callback?.(toast.id);
      onDone(toast.id);
    }, TOAST_HIDE_TIMEOUT + TOAST_REMOVE_TIMEOUT);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(cleanupTimer);
    };
  }, []);

  return (
    <div
      className={cx(
        'absolute', // 疊在同一個位置
        'full_toast',
        'bgi-text-[var(--grayscale-15)]',
        'transition-opacity duration-300 ease-in-out',
        'pointer-events-none',
        {
          'opacity-100': isVisible,
          'opacity-0': !isVisible,
        }
      )}
    >
      <div className="inner">{toast.message}</div>
    </div>
  );
};
