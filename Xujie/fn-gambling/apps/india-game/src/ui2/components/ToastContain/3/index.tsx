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

export interface ToastItem extends ToastResult {}

export const ToastContain = forwardRef(() => {
  const toastResult = useToastStore((state) => state.toastResult);
  const [toast, setToast] = useState<ToastItem | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]); // 寄存器
  const [isVisible, setIsVisible] = useState(false);

  //  寄存
  useEffect(() => {
    if (toastResult.message === '') return;
    const id = toastResult.id ? toastResult.id : uuidv4();
    const last = { ...toastResult, id };
    setToasts((prevState) => [...prevState, last]);
  }, [toastResult]);

  // 顯示，動畫，time out，刪除實體
  useEffect(() => {
    const last = toasts[toasts.length - 1];
    if (last) {
      setToast(last); // 讓 toast UI 顯示
      setupVisible(); // 設定動畫， timeout 動畫結束
      removeEntity(last.id || ''); // 動畫結束 呼叫實體 callback & 刪除實體
    }
  }, [toasts]);

  // 控制 動畫
  const setupVisible = () => {
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, TOAST_HIDE_TIMEOUT + 500); // 因為動畫需要時間，動畫約 in: 0.0, up: 0.5, onAnimationEnd 停留 1.5
  };

  // 刪除實體，呼叫callback
  const removeEntity = (id: string) => {
    setTimeout(() => {
      setToasts((prevState) =>
        prevState.filter((item) => {
          if (item.id === id) {
            // 寄存器中找到實體，呼叫 callback
            item.callback && item.callback(item.id || '');
          }
          return item.id != id;
        })
      );
      setToast(null);
    }, TOAST_HIDE_TIMEOUT + TOAST_REMOVE_TIMEOUT); // 2.0秒後再刪除實體
  };

  return createPortal(
    <div
      className={cx(
        'fixed left-0 z-[1200] top-[230px] w-full flex flex-col items-center gap-2 pointer-events-none'
      )}
    >
      {toast && (
        <div
          key={toast.id}
          className={cx('full_toast animate__animated ', '', {
            'animate__customDown animate__fast': isVisible,
            'animate__customUp animate__fast': !isVisible,
          })}
        >
          {toast.message}
        </div>
      )}
    </div>,
    document.body
  );
});

export default ToastContain;
