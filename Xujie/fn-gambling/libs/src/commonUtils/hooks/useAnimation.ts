import { useEffect, useState } from 'react';

export const useAnimation: (
  defaultAnimate?: string,
  duration?: number,
  isClean?: boolean // 动画执行完清除className,解决屏幕百分比<100% 模糊问题
) => {
  animate?: string;
  runAnimate: (name: string, callback?: () => void) => void;
} = (defaultAnimate, duration = 500, isClean = true) => {
  const [animate, setAnimate] = useState(defaultAnimate);
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--animate-duration',
      `${duration / 1000}s`
    );
    if (!defaultAnimate) return;
    if (!isClean) return;
    const timer = setTimeout(() => {
      setAnimate('');
    }, duration);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  const runAnimate = async (name: string, callback?: () => void) => {
    setAnimate(name);
    callback &&
      setTimeout(() => {
        setAnimate('');
        callback?.();
      }, duration);
  };
  return { animate: animate ? `animate__animated ${animate}` : '', runAnimate };
};

export default useAnimation;
