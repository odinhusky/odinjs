import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { ToastUI } from './ToastUI';
import {
  ToastResult,
  useToastStore,
} from '@libs/mode2/zustand/components/toastStore';
import { v4 as uuidv4 } from 'uuid';
import { useBreakPoint, useDeepEffect } from '@libs/commonUtils';
import { TOAST_HIDE_TIMEOUT, TOAST_REMOVE_TIMEOUT } from '@libs/constant/toast';

export interface ToastItem extends ToastResult {
  visible: boolean;
}

const DEFAULT_MOBILE_TOAST_ITEM: ToastItem = {
  id: '',
  message: '',
  visible: false,
};

export const ToastContain = forwardRef(() => {
  const { isMobile } = useBreakPoint();
  const toastResult = useToastStore((state) => state.toastResult);
  const [toasts, setToasts] = useState<ToastItem[]>([]); // 消息集合

  const [mobileToastItem, setMobileToastItem] = useState<ToastItem>({
    ...DEFAULT_MOBILE_TOAST_ITEM,
  }); // 手機版時要顯示的 toast 物件

  const mobileCallbackFn = useCallback(() => {
    mobileToastItem?.callback?.(mobileToastItem?.id || '');
  }, [mobileToastItem?.id]);

  useEffect(() => {
    if (toastResult.message === '') return;
    const id = toastResult.id ? toastResult.id : uuidv4();
    setToasts((prev) => [...prev, { ...toastResult, id: id, visible: true }]);

    let hideToast: NodeJS.Timeout | null = null;
    let removeToastTimeout: NodeJS.Timeout | null = null;

    hideToast = setTimeout(() => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id ? { ...toast, visible: false } : toast
        )
      );
      removeToastTimeout = setTimeout(() => {
        removeToast(id);

        if (!isMobile) toastResult?.callback?.(id);

        return () => {
          if (removeToastTimeout) clearTimeout(removeToastTimeout);
        };
      }, TOAST_REMOVE_TIMEOUT);

      return () => {
        if (hideToast) clearTimeout(hideToast);
      };
    }, TOAST_HIDE_TIMEOUT);
  }, [toastResult]);

  useDeepEffect(() => {
    if (toasts.length > 0) {
      const lastToastItem = toasts[toasts.length - 1];

      setMobileToastItem(lastToastItem);
    } else {
      setMobileToastItem({
        ...DEFAULT_MOBILE_TOAST_ITEM,
      });
    }
  }, [toasts]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <>
      <ToastUI
        toasts={toasts}
        mobileToastMsg={mobileToastItem.message}
        mobileCallbackFn={mobileCallbackFn}
      />
    </>
  );
});

export default ToastContain
