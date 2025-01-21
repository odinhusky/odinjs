import { useEffect } from 'react';
import sdkUtils from '@mode2/utils/sdk';

/**
 * 避免 apk GC 問題
 */
export const useAvoidApkRecycling = () => {
  useEffect(() => {
    let dom: HTMLDivElement | null = null;
    // 是apk內 或 android 内核
    if (sdkUtils.isInNative() && sdkUtils.isAndroidKernel()) {
      dom = document.createElement('div');
      dom.setAttribute('id', 'avoidGC');
      dom.className = 'z-[9999] h-px w-px animate-spin-reverse';
      document.body.appendChild(dom);
    }

    const handleFocus = () => {
      // console.log('@@@===> 對應 apk GC問題');
    };

    const handleBlur = () => {
      // console.log('@@@===> 對應 apk GC問題');
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // 清理事件监听器
    return () => {
      if (dom) {
        document.body.removeChild(dom);
      }
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);
};

export default useAvoidApkRecycling;
