import { To, useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { NavigateOptions } from 'react-router/dist/lib/context';
import { useRef } from 'react';
import { useDeepEffect } from '@libs/commonUtils';
import isEqual from 'lodash/isEqual';
import { useElementScroll } from '@commonUtils/useElementScroll';

/**
 * 改寫 useNavigate，使其避免重複導航，同時支持 delta 導航。
 * 返回的 navigate 函數完全可以替代原生的 useNavigate。
 */
export const useShouldNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollToTop } = useElementScroll();
  const lastPathname = useRef<string>('');
  const lastNavigateOptions = useRef<NavigateOptions | undefined>();

  useDeepEffect(() => {
    lastPathname.current = location.pathname;
  }, [location.pathname]);

  /**
   * 擴展的 navigate 函數
   * @param to - 目標路徑 (to) 或歷史導航步數 (delta)
   * @param options - 可選的導航選項（僅適用於路徑導航）
   */
  const shouldNavigate = (to: To | number, options?: NavigateOptions) => {
    if (typeof to === 'string' || typeof to === 'object') {
      const toPath = typeof to === 'string' ? to : to.pathname || '/';
      if (lastPathname.current === toPath) {
        if (!isEqual(lastNavigateOptions.current?.state, options?.state)) {
          navigate(to, options);
          lastNavigateOptions.current = options;
        } else {
          // 若被判斷不導航，scroll windows to Top
          scrollToTop('');
        }
      } else {
        navigate(to, options);
        lastNavigateOptions.current = options;
      }
    } else if (typeof to === 'number') {
      navigate(to);
      lastNavigateOptions.current = options;
    } else {
      navigate(to, options);
    }
  };

  return shouldNavigate;
};

export default useShouldNavigate;
