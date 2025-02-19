import { useEffect } from 'react';

export const useMode3MoreGamePageBaseOverride = () => {
  // body 鎖 overflow-hidden
  useEffect(() => {
    let x = setTimeout(() => {
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
};

export default useMode3MoreGamePageBaseOverride;
