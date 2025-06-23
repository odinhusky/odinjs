import { useState, useEffect, useRef } from 'react';

interface UpdateParams {
  from: number;
  to: number;
  intervals: number[];
  incrementRanges: [number, number][];
  resetTrigger?: unknown; // 任何變化時會重新計時
}
/**
 * @author Odin
 * @description 根據 不同的 intervals 區間秒數對應到不同的 incrementRanges，將 from 開始增加 incrementRanges，在不同的秒數過後增加不同的 incrementRanges
 */
export const useIncrementalUpdate = ({
  from,
  to,
  intervals,
  incrementRanges,
  resetTrigger,
}: UpdateParams) => {
  const [count, setCount] = useState(from);
  const prevCountRef = useRef(from); // 追蹤上一次的 count
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    let currentCount = from; // 確保從 from 開始
    currentIndexRef.current = 0; // 重置 index
    prevCountRef.current = 0; // 初始 prevCount 設為 0
    setCount(from); // 立即將 count 設為 from

    const update = () => {
      if (currentCount >= to) {
        return; // 終止更新
      }

      // 取得當前的間隔時間與增量範圍
      const intervalTime = intervals[currentIndexRef.current] * 1000; // 轉成毫秒
      const [minIncrement, maxIncrement] =
        incrementRanges[currentIndexRef.current];
      const randomIncrement =
        Math.random() * (maxIncrement - minIncrement) + minIncrement;

      // 計算新的數值
      const newCount = Math.min(currentCount + randomIncrement, to);

      prevCountRef.current = currentCount; // 🔥 更新 prevCount
      setCount(newCount);
      currentCount = newCount; // 更新 currentCount，以便下一次計算

      // 更新索引，確保循環 intervals 陣列
      currentIndexRef.current =
        (currentIndexRef.current + 1) % intervals.length;

      // 設置下一次更新
      timeoutRef.current = setTimeout(update, intervalTime);
    };

    // **延遲執行，等待第一個 intervals 秒後開始**
    timeoutRef.current = setTimeout(
      update,
      intervals[currentIndexRef.current] * 1000
    );

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [from, to, intervals, incrementRanges, resetTrigger]); // 🔥 監聽 resetTrigger 變化

  return {
    count,
    prevCount: prevCountRef.current,
  } as const; // 🔥 返回 count 和 prevCount
};

export default useIncrementalUpdate;
