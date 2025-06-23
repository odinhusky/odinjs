import { EffectCallback, useEffect, useRef } from 'react';

export const useEffectOnce = (callback: EffectCallback) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      callback();
    }
  }, []);
};

export default useEffectOnce;
