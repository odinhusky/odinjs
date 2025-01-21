import { useEffect, useRef, useState } from 'react';
import { countDownStore } from '@libs/mode2/localforage/stroe';

interface UseDurationCountDownProps {
  duration: number;
  key?: string;
  onEnd?: VoidFunction;
  forceUpdateDurationCount?: number;
}

/**
 * @author odin
 * @param {number} duration - 需要倒數的總秒數
 * @param {string} key - 存儲於 countDownStore 的 key
 * @param {VoidFunction} onEnd - 倒數結束時的 callback
 * @param {number} forceUpdateDurationCount - 當 duration 相同但是 count 變化時，依然造成 duration 重置
 *
 * @return
 * @property {boolean} isCountEnd - 是否倒數結束。
 * @property {number} remainSec - 剩餘秒數，若為 0 則倒數已完成。
 * @description 給予特定時間(秒單位)進行倒數，如果中途元件倒數被中斷，或是轉換頁面，會將秒數紀錄在 localforage 中，下次被呼叫且帶有相同的 key 時，則會從 localforage 中取得上次倒數的秒數，在開始進行倒數
 */
export const useDurationCountDown = ({
  duration,
  key,
  onEnd,
  forceUpdateDurationCount,
}: UseDurationCountDownProps) => {
  const [remainSec, setRemainSec] = useState<number>(duration); // 剩餘秒數
  const [isCountEnd, setIsCountEnd] = useState(false);

  const intervalTimer = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    setRemainSec(duration);
    setIsCountEnd(false);
  }, [duration, forceUpdateDurationCount]);

  useEffect(() => {
    if (!key) return;

    const getSavedTime = async () => {
      try {
        const savedTime = await countDownStore.getItem<number>(key);

        if (savedTime !== null && savedTime > 0) {
          setRemainSec(savedTime);
        } else if (savedTime === 0) {
          countDownStore.removeItem(key).catch((error) => {
            console.error('Error removing countdown key:', error);
          });
        }
      } catch (e) {
        console.error(
          'Error handling => useDurationCountDown countdown getSavedTime:',
          e
        );
      }
    };

    getSavedTime();
  }, [key]);

  useEffect(() => {
    // exit early when we reach 0
    if (remainSec === 0) {
      if (isCountEnd === false) setIsCountEnd(true);
      onEnd?.();
      return;
    }

    // save intervalId to clear the interval when the
    // component re-renders
    intervalTimer.current = setInterval(() => {
      const leftRemainSec = remainSec - 1;
      setRemainSec(leftRemainSec);
      if (isCountEnd === true) setIsCountEnd(false);
      if (key) {
        countDownStore.setItem(key, leftRemainSec).catch((error) => {
          console.error('Error saving countdown data:', error);
        });
      }
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => {
      if (intervalTimer.current) clearInterval(intervalTimer.current);
    };
  }, [remainSec]);

  return { isCountEnd, remainSec };
};
