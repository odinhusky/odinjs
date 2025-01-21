import { useRef, EffectCallback, DependencyList } from 'react';
import useDeepEffect from './useDeepEffect';

export const useUpdateDeepEffect = (
  callback: EffectCallback,
  dependencies: DependencyList,
  isLayoutEffect?: boolean
) => {
  const isFirstRender = useRef(true);

  useDeepEffect(
    () => {
      if (isFirstRender.current) {
        isFirstRender.current = false; // 跳過第一次渲染
        return;
      }

      return callback(); // 依賴變動時觸發 effect
    },
    dependencies,
    isLayoutEffect
  );
};

export default useUpdateDeepEffect;
