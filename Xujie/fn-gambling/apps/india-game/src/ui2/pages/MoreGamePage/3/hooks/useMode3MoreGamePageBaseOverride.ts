import { useEffect } from 'react';
import { useMoreGamePageStoreStore } from '@mode2/zustand/page/moreGamePage';

export const useMode3MoreGamePageBaseOverride = () => {
  // body 鎖 overflow-hidden
  useEffect(() => {
    const x = setTimeout(() => {
      const body = document.querySelector('body');
      if (body) {
        body.classList.add('overflow-hidden');
      }
    }, 500);

    return () => {
      const body = document.querySelector('body');
      if (body) {
        body.classList.remove('overflow-hidden');
      }

      clearTimeout(x);
    };
  }, []);

  // 離開清除分類狀態，避免下次進入無資料可以觸發狀態改變
  useEffect(() => {
    return () => {
      useMoreGamePageStoreStore.getState().setActivePlatformId(0);
      useMoreGamePageStoreStore.getState().setActivePlatform('');
      useMoreGamePageStoreStore.getState().setActiveManufacturer('');
    };
  }, []);
};

export default useMode3MoreGamePageBaseOverride;
