import { useDurationCountDown } from './useDurationCountDown';

interface UseGivenTimeCountDownProps {
  targetDate: Date; // 給定的目標時間
  onEnd?: VoidFunction; // 倒數結束時的 callback
}

/**
 * @author odin
 * @param {Date} targetDate - 給定的時間
 * @param {VoidFunction} onEnd - 倒數結束時的 callback
 
 * @return
 * @property {boolean} isCountEnd - 是否倒數結束。
 * @property {number} remainSec - 剩餘秒數，若為 0 則倒數已完成。
 * @description 給予特定時間點，進行倒數，
 */
export const useGivenTimeCountDown = ({
  targetDate,
  onEnd,
}: UseGivenTimeCountDownProps) => {
  if (targetDate instanceof Date === false) {
    console.error('param (targetDate) is not a valid Date!');
    return { isCountEnd: false, remain: 0 };
  }

  const targetSec = Math.floor(targetDate.getTime() / 1000);
  const nowSec = Math.floor(Date.now() / 1000);
  const duration = targetSec > nowSec ? targetSec - nowSec : 0;

  const { isCountEnd, remainSec } = useDurationCountDown({
    duration,
    onEnd,
  });

  return { isCountEnd, remainSec };
};

export default useGivenTimeCountDown;
