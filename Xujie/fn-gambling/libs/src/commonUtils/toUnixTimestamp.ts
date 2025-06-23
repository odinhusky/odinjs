import dayjs from 'dayjs';

/**
 * 將任意格式（string, Date, number）轉換為 Unix timestamp
 * 自動判斷數字是秒還是毫秒
 * @param {string|Date|number} input - 輸入資料，可為時間字串、Date、timestamp 數字
 * @param {'s'|'ms'} unit - 目標單位（'s' 秒，'ms' 毫秒），預設 'ms'
 * @returns {number|null} 統一為時間戳
 */
export function toUnixTimestamp(
  input: string | Date | number,
  unit: string = 's'
): number {
  let d;

  if (typeof input === 'number') {
    // 判斷是秒還是毫秒
    if (input > 1e12) {
      // 是毫秒
      d = dayjs(input);
    } else {
      // 是秒
      d = dayjs(input * 1000);
    }
  } else {
    d = dayjs(input);
  }

  if (!d.isValid()) return 0;

  return unit === 'ms' ? d.valueOf() : d.unix();
}
