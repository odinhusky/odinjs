import {
  useEffect,
  useRef,
  EffectCallback,
  DependencyList,
  useLayoutEffect,
} from 'react';

export const useUpdateEffect = (
  callback: EffectCallback,
  dependencies: DependencyList,
  isLayoutEffect?: boolean
) => {
  const isFirstRender = useRef(true);

  const effect = isLayoutEffect ? useLayoutEffect : useEffect;

  effect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // 跳過第一次渲染
      return;
    }

    return callback(); // 依賴變動時觸發 callback
  }, dependencies);
};

export default useUpdateEffect;
