import { useEffect, useRef, useState } from 'react';

export interface ElementMetrics {
  width: number;
  height: number;
  x: number;
  y: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export const defElementMetrics: ElementMetrics = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};
export const useObserverElementMetrics = <E extends HTMLElement>() => {
  const elementRef = useRef<E>(null);

  const [elementMetrics, setElementMetrics] =
    useState<ElementMetrics>(defElementMetrics);

  useEffect(() => {
    const element: HTMLElement | null = elementRef.current;

    const updateMetrics = () => {
      if (element) {
        const rect = element.getBoundingClientRect();
        setElementMetrics({
          width: rect.width,
          height: rect.height,
          x: rect.x,
          y: rect.y,
          top: rect.top,
          left: rect.left,
          right: rect.right,
          bottom: rect.bottom,
        });
      }
    };
    // ResizeObserver 來監測大小變化
    const resizeObserver = new ResizeObserver(() => {
      updateMetrics();
    });

    // 滾動事件監測
    const handleScroll = () => {
      updateMetrics();
    };

    // 開始監測
    if (element) {
      resizeObserver.observe(element);
      window.addEventListener('scroll', handleScroll, true); // 捕獲階段監聽
    }

    // 清理 observer
    return () => {
      if (element) {
        resizeObserver.unobserve(element);
      }
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  return {
    elementRef,
    elementMetrics,
  };
};
