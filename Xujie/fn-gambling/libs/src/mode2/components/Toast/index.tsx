import React, { forwardRef, useEffect, useState } from 'react';
import { ToastUI } from './ToastUI';
import {
  ToastResult,
  useToastStore,
} from '@libs/mode2/zustand/components/toastStore';
import { v4 as uuidv4 } from 'uuid';

export interface ToastItem extends ToastResult {
  visible: boolean;
}

const Toast = forwardRef(() => {
  const toastResult = useToastStore((state) => state.toastResult);
  const [toasts, setToasts] = useState<ToastItem[]>([]); // 消息集合
  const [animMobileVisible, setAnimMobileVisible] = useState(true);

  useEffect(() => {
    if (toastResult.message === '') return;
    const id = toastResult.id ? toastResult.id : uuidv4();
    setToasts((prev) => [...prev, { ...toastResult, id: id, visible: true }]);
    setAnimMobileVisible(true);
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id ? { ...toast, visible: false } : toast
        )
      );
      setTimeout(() => {
        removeToast(id);
        setAnimMobileVisible(false);
        toastResult.callback && toastResult.callback(id);
      }, 250);
    }, 2000);
  }, [toastResult]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <>
      <ToastUI animMobileVisible={animMobileVisible} toasts={toasts} />
    </>
  );
});

export const ToastContain = () => {
  return <Toast />;
};
