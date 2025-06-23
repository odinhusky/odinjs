import { useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';

/**
 * useDebouncedEffect
 * 只有當 deps 穩定超過 delay，才執行副作用
 */
export const useDebouncedEffect = (
  effect: () => void | (() => void),
  deps: React.DependencyList,
  delay: number
) => {
  const cleanupRef = useRef<void | (() => void)>();
  const effectRef = useRef(effect);

  // 保存最新副作用
  useEffect(() => {
    effectRef.current = effect;
  }, [effect]);

  // 只有當 deps 穩定 delay 時間，才執行 effect
  useEffect(() => {
    const handler = debounce(() => {
      if (typeof cleanupRef.current === 'function') {
        cleanupRef.current();
      }
      cleanupRef.current = effectRef.current();
    }, delay);

    handler(); // 開始 debounce 排程

    return () => {
      handler.cancel(); // 取消上一次 debounce 排程
    };
  }, [...deps, delay]);
};

export default useDebouncedEffect;
