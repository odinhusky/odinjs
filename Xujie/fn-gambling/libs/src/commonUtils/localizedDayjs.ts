import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { AppLocalStorageKey } from '@libs/mode2/utils/sdk/persistant/storageKey';
import sdkUtils from '@libs/mode2/utils/sdk';

/**
 * 帶時區的 dayjs 實例
 * @param date
 * @param format
 * @returns 帶時區的 dayjs 實例
 */
export default (date?: dayjs.ConfigType, format?: string) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const locale = sdkUtils.getStorage(AppLocalStorageKey.TIMEZONE) || '';

  // 支援的時區清單
  const supportedTimezones = ['Asia/Shanghai', 'Asia/Kolkata'] as const;
  type SupportedTimezone = (typeof supportedTimezones)[number];

  // 檢查是否為合法時區
  const isValidTimezone = (tz: string): tz is SupportedTimezone => {
    return supportedTimezones.includes(tz as SupportedTimezone);
  };

  const DEFAULT_TIMEZONE = isValidTimezone(locale) ? locale : undefined;

  if (!date || !dayjs.utc(date, format, true).isValid()) {
    return dayjs.utc().tz(DEFAULT_TIMEZONE); // 返回當前 UTC + 時區時間
  }

  // 如果有支援的時區，則使用該時區
  if (DEFAULT_TIMEZONE) {
    return format
      ? dayjs.utc(date, format).tz(DEFAULT_TIMEZONE)
      : dayjs.utc(date).tz(DEFAULT_TIMEZONE);
  }

  // 否則返回原始 UTC 實例
  return format ? dayjs(date, format) : dayjs(date);
};
