import { useEffect, useRef, useState } from 'react';

const pad = (num: number, size: number = 2): string => {
  num = Math.max(num, 0); // 避免負數
  let s = String(num);
  while (s.length < size) s = '0' + s;
  return s;
};

/**
 * 判斷是否為10位時間戳（秒級），如果是則轉為13位毫秒級時間戳
 * @param timestamp - 可能是10位或13位的時間戳
 * @returns 轉換後的13位時間戳
 */
const normalizeTimestamp = (timestamp: number): number => {
  // 如果小于 1e12（即 2001-09-09T01:46:39Z），认为是秒级时间戳
  return timestamp < 1e12 ? timestamp * 1000 : timestamp;
};

/**
 * 格式化毫秒為時間字串
 * @param ms
 * @param millisecondDigits
 * @param formatType 格式化規則 fullTime 需要再加
 * @returns
 */
type FormattedTimeResult = {
  timeStr: string; // 帶毫秒位數：01:23.45
  pureTime: string; // 不帶毫秒：01:23
  // fullTime: string; // 全拼格式：01分23秒45毫秒
  millisecondPart: string; // 毫秒部分：45
};
const formatTime = (
  ms: number,
  millisecondDigits: number = 2
): FormattedTimeResult => {
  if (ms <= 0) {
    const msPlaceholder =
      millisecondDigits > 0 ? '.' + '0'.repeat(millisecondDigits) : '';
    const zeroMs = '0'.repeat(millisecondDigits);
    return {
      timeStr: `00:00${msPlaceholder}`,
      pureTime: `00:00`,
      // fullTime: `00分00秒${zeroMs}毫秒`,
      millisecondPart: zeroMs,
    };
  }

  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  let mmss = `${pad(minutes)}:${pad(seconds)}`;
  // let fullTimeStr = `${pad(minutes)}分${pad(seconds)}秒`;

  let millisecondPart = '';
  if (millisecondDigits > 0) {
    const milliseconds = Math.floor(
      ((ms % 1000) * Math.pow(10, millisecondDigits)) / 1000
    );
    millisecondPart = pad(milliseconds, millisecondDigits);
    mmss += `.${millisecondPart}`;
    // fullTimeStr += `${millisecondPart}毫秒`;
  }

  if (hours > 0) {
    mmss = `${pad(hours)}:${mmss}`;
    // fullTimeStr = `${pad(hours)}小时${fullTimeStr}`;
  }

  return {
    timeStr: mmss,
    pureTime: `${pad(hours > 0 ? hours : minutes)}:${pad(seconds)}`,
    // fullTime: fullTimeStr,
    millisecondPart,
  };
};

type UseCountdownOptions = Readonly<{
  /**
   * 倒計時時長（毫秒），與 endTime 互斥
   */
  duration?: number;
  /**
   * 指定結束時間（10位或13位時間戳），與 duration 互斥
   */
  endTime?: number;
  /**
   * 倒計時結束時的回調
   */
  onEnd?: () => void;
  /**
   * 毫秒顯示位數，預設2位，0不顯示毫秒數
   */
  millisecondDigits?: number;
}> &
  (
    | { duration: number; endTime?: never }
    | { endTime: number; duration?: never }
  );

/**
 * 毫秒倒數計時
 * 支援兩種模式：duration（持續時間）或 endTime（指定結束時間）
 *
 * @param options → 設定參數物件
 * @param options.duration（毫秒） → 倒數計時時長
 * @param options.endTime（10位或13位時間戳）→ 指定結束時間
 * @param options.millisecondDigits → 毫秒顯示位數，預設2位，0不顯示毫秒數
 * @returns { TMillisecondCountdownResult }
 * @example
 *
 * 方式一：傳入10位時間戳
 * const nowSec = Math.floor(Date.now() / 1000);
 * const endTime = nowSec + 15; // 15 秒後結束
 * const { formattedTime } = useCountdown({
 *  endTime,
 *  onEnd: () => {
 *    console.log('時間到！');
 *  },
 * });
 *
 * 方式二：傳入duration時長
 * const { formattedTime } = useCountdown({
 *  duration: 10000, // 10 秒
 *  onEnd: () => {
 *    console.log('倒數計時結束！');
 *  },
 * });
 */
type TMillisecondCountdownResult = {
  timeLeft: number; // 剩餘毫秒數
  formattedTime: string; // 帶毫秒的時間字串，如 "01:23.45"
  pureTime: string; // 不帶毫秒的時間字串，如 "01:23"
  millisecondPart: string; // 毫秒部分，如 "45"
};
export const useMillisecondCountdown = (
  options: UseCountdownOptions
): TMillisecondCountdownResult => {
  const { onEnd } = options;
  const isEndTimeMode = typeof options.endTime !== 'undefined';
  const millisecondDigits = options.millisecondDigits ?? 2; // 預設 2 位

  // 參數合法性校驗
  let safeDuration = options.duration ?? 0;
  let safeEndTime = options.endTime ?? Date.now();
  if (
    !isEndTimeMode &&
    (typeof safeDuration !== 'number' || safeDuration <= 0)
  ) {
    // console.warn('Invalid duration provided, defaulting to 0');
    safeDuration = 0;
  }

  if (isEndTimeMode && (typeof safeEndTime !== 'number' || safeEndTime <= 0)) {
    // console.warn('Invalid endTime provided, defaulting to current time');
    safeEndTime = Date.now();
  }

  const getEndTime = () => {
    if (isEndTimeMode) {
      return normalizeTimestamp(safeEndTime); // 將輸入的時間統一轉換為毫秒
    } else {
      return Date.now() + safeDuration;
    }
  };

  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(getEndTime() - Date.now(), 0)
  );

  const [formattedTime, setFormattedTime] = useState<{
    timeStr: string;
    pureTime: string;
    // fullTime: string;
    millisecondPart: string;
  }>(() => formatTime(timeLeft, millisecondDigits));

  const endTimeRef = useRef<number>(getEndTime());
  const frameRef = useRef<number | null>(null);
  const calledRef = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const update = () => {
    const now = Date.now();
    const diff = endTimeRef.current - now;
    const safeDiff = Math.max(diff, 0);

    if (safeDiff <= 0) {
      setTimeLeft(0);
      setFormattedTime(formatTime(0, millisecondDigits));
      if (!calledRef.current && isMounted.current) {
        onEnd?.();
        calledRef.current = true;
      }
      return;
    }

    setTimeLeft(safeDiff);
    setFormattedTime(formatTime(safeDiff, millisecondDigits));
    frameRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    endTimeRef.current = getEndTime();
    calledRef.current = false;
    frameRef.current = requestAnimationFrame(update);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [options.duration, options.endTime, options.millisecondDigits]);

  return {
    timeLeft,
    formattedTime: formattedTime.timeStr,
    pureTime: formattedTime.pureTime,
    // fullTime: formattedTime.fullTime,
    millisecondPart: formattedTime.millisecondPart,
  };
};

export default useMillisecondCountdown;
