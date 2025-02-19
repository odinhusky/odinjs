import { useEffect, useState } from 'react';

interface AnimateCounterProps {
  from: number;
  to: number;
  duration?: number; // 動畫時間 (毫秒)
  decimalPlaces?: number; // 小數點位數
  className?: string;
  trigger?: unknown; // 觸發動畫的條件
  formatter?: (value: number) => string; // 自訂格式化函數
}

export const AnimateCounter = ({
  from,
  to,
  duration = 2000,
  decimalPlaces = 2,
  className,
  trigger,
  formatter,
}: AnimateCounterProps) => {
  const [count, setCount] = useState(from);
  const step = Math.pow(10, -decimalPlaces); // 計算步進值

  useEffect(() => {
    setCount(from); // 重置 count

    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      let value = from + (to - from) * progress;

      // 限制數字變化範圍，只允許 `decimalPlaces` 控制的精度
      value = Math.round(value / step) * step;

      // **解決浮點數問題**
      value = parseFloat(value.toFixed(decimalPlaces));

      setCount(value);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [trigger, from, to, duration]);

  // 使用自訂格式化函數（如果沒有則使用預設格式）
  const formattedCount = formatter
    ? formatter(count)
    : count.toFixed(decimalPlaces);

  return <span className={className}>{formattedCount}</span>;
};

export default AnimateCounter;
