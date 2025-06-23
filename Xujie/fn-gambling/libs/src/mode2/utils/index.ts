import dayjs from '@commonUtils/localizedDayjs';
import { EResourceLevel, getImgUrl } from '@mode2/utils/img';
import sdkUtils from '@mode2/utils/sdk';
// import { InputProps } from '@libs/components/Input';
import tailwindVariables from '@libs/plugins/tailwindcss/tailwind.variables';
import { AppLocalStorageKey } from './sdk/persistant/storageKey';
import { useTemplateLayoutStore } from '../zustand/template/templateLayoutStore';

export * from './img/index';
export * from './sdk/index';
/**
 * 根据窗口调整 html fontSize
 * @param current
 * @param target
 * @returns {boolean}
 */
export const adaptHtmlFontSize: (screens?: Record<string, string>) => void = (
  screens = tailwindVariables.tailwindVariables.theme.screens
) => {
  // 窗口width < phone size, 改变窗口大小时重新设置 rem
  const phonePoint = parseInt(screens['phone']?.replace('px', '')) || 375;
  const setRem = () => {
    const fontSizeValue =
      window.innerWidth < phonePoint
        ? window.innerWidth / (phonePoint / 16)
        : 16;
    const currentPxValue = fontSizeValue / 16;

    document.documentElement.style.fontSize = `${fontSizeValue}px`;

    useTemplateLayoutStore.getState().setCurrentPxTimes(currentPxValue);
  };

  setRem();
  window.onresize = () => {
    setRem();
  };
};

/**
 * <html style={"backgroundColor":"${vat()}"}>
 * <title>{title}</title>
 * <link rel="icon" type="image/x-icon" href={"/favicon.ico"} />
 */
export const replaceHtmlProductInformation = () => {
  const setHtmlBackground = () => {
    document.documentElement.style.backgroundColor = 'var(--bg-html)';
  };

  const setFaviconIcon = () => {
    const faviconRes = getImgUrl(EResourceLevel.LOGO, 'favicon', '.ico');
    let faviconElement = document.getElementById(
      'favicon'
    ) as HTMLLinkElement | null;
    if (!faviconElement) {
      faviconElement = document.createElement('link');
      faviconElement.id = 'favicon'; // 给新元素设定 ID，便于下次查找
      faviconElement.rel = 'icon';
      faviconElement.type = 'image/x-icon';
      document.head.appendChild(faviconElement);
    }
    faviconElement.href = faviconRes;
  };

  const setTitle = () => {
    const title = `${sdkUtils.productName()} | Online casinos for millions in ${sdkUtils.countryName()}, instant deposits and withdrawals`;
    if (title) {
      document.title = title;
    }
  };

  setHtmlBackground();
  setFaviconIcon();
  setTitle();
};

/**
 * 格式化金額字串
 * 處理貨幣符號顯示,千分位顯示方式,小數點後保留位數, 小數點保留位數後四捨五入
 * @returns 如'₹4,001' 或 '₹4001.00' 或 '₨1,234,567.89' 或 '₨1,234,567'
 */

interface FormatMoneyParams {
  value: number;
  showCurrency?: boolean; // 是否顯示貨幣符號 (default true)
  includeDecimal?: boolean; // 是否顯示小數部分 (default false)
  decimals?: number; // 小數點後的數量 (default 2)
  includeComma?: boolean; // 是否顯示千分位分隔符 (default false)
}

export const formatMoney = ({
  value,
  showCurrency = true,
  includeDecimal = true,
  decimals = 2,
  includeComma = true, // 是否顯示千分位分隔符 (default false)
}: FormatMoneyParams): string => {
  const valueInput = value || 0;
  const countryCurrency = import.meta.env['VITE_COUNTRY_CURRENCY'];
  const locale = sdkUtils.getStorage(AppLocalStorageKey.LANG) || 'en-US';

  const dynamicObj = showCurrency
    ? { style: 'currency' as const, currency: countryCurrency }
    : {};

  const isInteger = Number.isInteger(value);

  return valueInput.toLocaleString(locale, {
    ...dynamicObj,
    minimumFractionDigits: includeDecimal && !isInteger ? decimals : 0, // 保留的最小小數位數。如果数字的小数部分不足该位數，則補0
    maximumFractionDigits: includeDecimal && !isInteger ? decimals : 0, // 保留的最大小數位數。超出部分将被捨去（四捨五入）。
    useGrouping: includeComma,
  });
};

/**
 * 格式化金額字串
 * @author Odin
 * 依照 K, M, B 進行數字的縮寫，如果不滿100000則依照formatMoney的邏輯處理，縮寫後有小數點的情況依照 param{includeDecimal} 以及 param{decimals} 做處理
 * @param num - 需要格式化的数值
 * @param includeDecimal - 是否顯示小數部分(default false)
 * @param decimals - 保留幾位小数（default 2）
 * @param startAbbrevNum - 從這個 startAbbrevNum 數值以上才開始進行縮寫
 * @param showCurrency - 是否顯示貨幣符號(default true)
 */

interface formatMoneyAbbrevParamsTypes {
  value: number;
  includeDecimal?: boolean;
  decimals?: number;
  startAbbrevNum?: number;
  showCurrency?: boolean;
}

export const formatMoneyAbbrev = ({
  value,
  includeDecimal = true,
  decimals = 2,
  startAbbrevNum = 100_000,
  showCurrency = true,
}: formatMoneyAbbrevParamsTypes): string => {
  // 小於 100,000，正常顯示完整數值
  if (startAbbrevNum && value < startAbbrevNum) {
    return formatMoney({
      value,
      includeDecimal,
      decimals,
      showCurrency,
    });
  }

  const abbrevThresholds = [
    { value: 1_000_000_000, suffix: 'B' },
    { value: 1_000_000, suffix: 'M' },
    { value: 1_000, suffix: 'K' },
  ];

  const countryCurrency = import.meta.env['VITE_COUNTRY_CURRENCY'];
  const locale = sdkUtils.getStorage(AppLocalStorageKey.LANG) || 'en-US';

  for (const { value, suffix } of abbrevThresholds) {
    if (value >= value) {
      let formattedNum = value / value;
      const isInteger = Number.isInteger(formattedNum);

      if (!includeDecimal) {
        formattedNum = Math.floor(formattedNum); // 無條件捨去小數
      } else if (!isInteger) {
        formattedNum = Number(formattedNum.toFixed(decimals)); // 控制小數位數
      }

      return (
        new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: countryCurrency,
          minimumFractionDigits: includeDecimal && !isInteger ? decimals : 0,
          maximumFractionDigits: includeDecimal && !isInteger ? decimals : 0,
        }).format(formattedNum) + suffix
      );
    }
  }

  return formatMoney({
    value,
    includeDecimal,
    decimals,
    showCurrency,
  });
};

/**
 * 格式化金額
 * 需求：整數部分 >= 4 位數 即開始進位
 * 1 進位前 即整數部分小於四位數展示全數(包含小數部分)
 * 2 進位後 要縮寫的位數不能超過4位數, 超過的話只留整數, 但整數還是超過的話進下一位；
 * example：
 * 1k = 1000
 * 10K = 10000
 * 100K = 100000
 * 1000K = 1百萬
 * 10M = 1千萬
 * @param value - 需要格式化的数值
 * @param includeDecimal - 進位前 是否顯示小數部分(default true)
 * @param decimals - 進位前 保留幾位小数（default 2）
 * @param includeComma - 進位前 是否顯示千分位（default false）
 * @param abbrevNum - 縮寫的數字（default 1000(四位數)， 應該可能也許不需要該參數，先放著）
 * @param startAbbrevNum - 小於 startAbbrevNum * 10，正常顯示完整數值。比如六位數要全數顯示, 100000-999999，就是1000000以下全數顯示，所以需要 * 10
 *
 * @param includeDecimalAbbrev - 進位後 是否顯示小數部分(default false)
 * @param decimalsAbbrev - 進位後 保留幾位小数（default 2）
 * @param includeCommaAbbrev - 進位後 是否顯示千分位（default false）
 *
 * @param showCurrency - 是否顯示貨幣符號(default true)
 * @returns
 * @example
 */
export const formatMoneyAbbrev4Digits = ({
  value,
  includeDecimal = true,
  decimals = 2,
  includeDecimalAbbrev = false,
  decimalsAbbrev = 2,
  showCurrency = true,
  includeComma = false,
  includeCommaAbbrev = false,
  startAbbrevNum = 100,
}: {
  value: number | string;
  includeDecimal?: boolean;
  decimals?: number;
  includeDecimalAbbrev?: boolean;
  decimalsAbbrev?: number;
  showCurrency?: boolean;
  includeComma?: boolean;
  includeCommaAbbrev?: boolean;
  startAbbrevNum?: number;
}): string => {
  let num = Number(value);
  if (isNaN(num)) {
    return formatMoney({ value: 0, includeComma: false });
  }

  // 小於 startAbbrevNum * 10，正常顯示完整數值
  if (startAbbrevNum && num < startAbbrevNum * 10) {
    return formatMoney({
      value: num,
      includeDecimal,
      decimals,
      showCurrency,
      includeComma,
    });
  }

  // 數值 >= 1000 且 < 10000，進位為K
  if (num >= 1000 && num < 10000) {
    return (
      formatMoney({
        value: num / 1000,
        showCurrency,
        includeDecimal: includeDecimalAbbrev,
        decimals: decimalsAbbrev,
        includeComma,
      }) + 'K'
    );
  }

  const units = ['', 'K', 'M', 'B', 'T'];
  let unitIndex = 0;

  while (unitIndex < units.length) {
    const intPart = Math.floor(num).toString();

    // 整數部分 <= 4 位數，不進位
    if (intPart.length <= 4) {
      const formatted = formatMoney({
        value: num,
        showCurrency,
        includeDecimal: includeDecimalAbbrev,
        decimals: decimalsAbbrev,
        includeComma: includeCommaAbbrev,
      });

      return formatted + units[unitIndex];
    }

    // 整數部分 > 4 位數，進入下一個單位
    num /= 1000;
    unitIndex++;
  }

  // 超出所有單位範圍
  const formatted = formatMoney({
    value: num,
    showCurrency,
    includeDecimal: includeDecimalAbbrev,
    decimals: decimalsAbbrev,
    includeComma: includeCommaAbbrev,
  });

  return formatted + units[units.length - 1];
};

/**
 * 今日時間戳區間
 *
 * @returns { [number, numebr] }
 * - The first number is the timestamp(s) for 00:00:00 of today.
 * - The second number is the timestamp(s) for 23:59:59 of today.
 */
export const getTodayTimestamp = (): [number, number] => {
  const now = new Date();
  const startTimestamp = Math.floor(now.setHours(0, 0, 0, 0) / 1000);
  const endTimestamp = Math.floor(now.setHours(23, 59, 59, 999) / 1000);
  return [startTimestamp, endTimestamp];
};

/**
 * 昨日時間戳區間
 *
 * @returns { [number, numebr] }
 * - The first number is the timestamp(s) for 00:00:00 of yesterday.
 * - The second number is the timestamp(s) for 23:59:59 of yesterday.
 */
export const getYesterdayTimestamp = (): [number, number] => {
  const [todayStartTimestamp, todayEndTimestamp] = getTodayTimestamp();
  const startTimestamp = todayStartTimestamp - 24 * 60 * 60;
  const endTimestamp = todayEndTimestamp - 24 * 60 * 60;
  return [startTimestamp, endTimestamp];
};

/** 从今天0点算起到上周的时间戳區間 */
export const getHasPassedWeekTimestamp = () => {
  const now = Date.now();
  const endTimestamp = Math.floor(now / 1000);
  const startTimestamp = endTimestamp - 7 * 24 * 60 * 60 + 1;
  return [startTimestamp, endTimestamp];
};

/** 从今天0点算起到上个月的时间戳區間 */
export const getHasPassedMonthTimestamp = () => {
  const now = Date.now();
  const endTimestamp = Math.floor(now / 1000);
  const startTimestamp = endTimestamp - 30 * 24 * 60 * 60 + 1;
  return [startTimestamp, endTimestamp];
};

/**
 * 日期顯示格式化
 *
 * @param timestamp - 時間戳(秒)
 * @param format - 格式化類型
 * @example
 * input: 1726818502
 * output: "20.09.2024 15:48"
 */
export const formatDate = (
  timestamp: number | undefined | null,
  format: string = 'DD.MM.YYYY HH:mm'
): string => {
  try {
    // 當 `timestamp` 為無效值時，返回 1970-01-01 00:00
    if (timestamp === undefined || timestamp === null || timestamp <= 0) {
      return dayjs(0).format(format);
    }

    // // 如果 `timestamp` 是數組
    // if (Array.isArray(timestamp)) {
    //   if (timestamp.length === 0) return [dayjs(0).format(format)]; // 空數組返回 [1970-01-01 00:00]
    //   return timestamp.map((t) => formatDate(t, format) as string);
    // }

    // 嘗試將 `timestamp` 轉換為數字
    const numericTimestamp = Number(timestamp);

    // 若 `numericTimestamp` 無法轉換或為負數，返回 1970-01-01
    if (isNaN(numericTimestamp) || numericTimestamp < 0) {
      console.error(`Invalid timestamp: ${timestamp}, returning default time.`);
      return dayjs(0).format(format);
    }

    // 格式化並返回
    return dayjs(numericTimestamp * 1000).format(format);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dayjs(0).format(format);
  }
};

/**
 * 剩余时间格式化
 *
 * @param timestamp - 時間戳(秒)
 * @param options - 後續增加格式規則
 * @example
 */
export const formatCountdownTime: (timestamp: number) => string = (
  timestamp
) => {
  const hour = Math.floor(timestamp / 3600);
  const minutes = Math.floor(timestamp / 60) - hour * 60;
  const seconds = timestamp % 60;

  const pad = (num: number): string => num.toString().padStart(2, '0');

  return `${hour > 0 ? pad(hour) + ':' : ''}${pad(minutes)}:${pad(seconds)}`;
};

/**
 * 仅英文名输入(只允许输入字母)
 *
 * @param event
 * @example
 */
// NOTE 改到 <BaseInput> 判斷， type={'en_name'}
// const disableInput = false;
// export const handleEnNameInput: InputProps['onInput'] = (event) => {
//   if (event?.currentTarget?.value) {
//     const value = event.currentTarget.value;
//     console.log('@@@===> handleEnNameInput', value);
//     if (/[^a-z|A-Z]/.test(value)) {
//       console.log('@@@===> handleEnNameInput IN', value);
//       event.preventDefault();
//       // event.currentTarget.value = value.replace(/[^a-z|A-Z]/g, '');
//       // if (disableInput) return;
//       // disableInput = true;
//       // setTimeout(() => {
//       //   event.currentTarget.value = value.replace(/[^a-z|A-Z]/g, '');
//       //   disableInput = false;
//       // }, 0);
//     }
//   }
// };

/**
 * 脫敏數字
 * @param str
 * @param digits 脫敏符號左右顯示數字位數
 * @param star 脫敏符號
 * @returns
 */
export const maskNumbers = (
  str: string,
  digits: number = 3,
  star: number = 4
) => {
  const regex = new RegExp(`(\\d{${digits}})\\d*(\\d{${digits}})`);
  const num = '*'.repeat(star);
  return str.replace(regex, `$1${num}$2`);
};

/**
 * 依照 年月週日時分秒，格式持續時間
 * @param durationTime
 */
export const formatDurationTimeSplit = (
  durationTime: number
): {
  years: string;
  months: string;
  weeks: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
} => {
  const years = Math.floor(durationTime / (60 * 60 * 24 * 365))
    .toString()
    .padStart(2, '0');
  durationTime %= 60 * 60 * 24 * 365;

  const months = Math.floor(durationTime / (60 * 60 * 24 * 30))
    .toString()
    .padStart(2, '0');
  durationTime %= 60 * 60 * 24 * 30;

  const weeks = Math.floor(durationTime / (60 * 60 * 24 * 7))
    .toString()
    .padStart(2, '0');
  durationTime %= 60 * 60 * 24 * 7;

  const days = Math.floor(durationTime / (60 * 60 * 24))
    .toString()
    .padStart(2, '0');
  durationTime %= 60 * 60 * 24;

  const hours = Math.floor(durationTime / (60 * 60))
    .toString()
    .padStart(2, '0');
  durationTime %= 60 * 60;

  const minutes = Math.floor(durationTime / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (durationTime % 60).toString().padStart(2, '0');

  return {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
  };
};

/**
 * File 转 base64
 * @param file
 * @returns
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * base64 转 File
 * @param base64Str
 * @param filename
 * @returns
 */
export const base64ToFile = (
  base64Str: string,
  filename: string = new Date().getTime().toString()
): File | string => {
  if (!base64Str) return '';
  const byteCharacters = atob(base64Str); // Base64 解码
  const byteArrays = [];

  // 将字符串转换为字节数组
  for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
    const slice = byteCharacters.slice(offset, offset + 1024);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    byteArrays.push(new Uint8Array(byteNumbers));
  }

  // 创建一个 Blob 对象（File 对象）并返回
  const blob = new Blob(byteArrays, { type: 'application/octet-stream' });
  return new File([blob], filename);
};

interface IDefaultParams {
  [key: string]: string | number | undefined;
}

/**
 * @description
 * @param dynamicKeys
 * @param search location.search
 * @param state location.state
 * @returns
 * const params = getParams(['id', 'url', 'launchType'], location.search, location.state);
 * console.log(params);
 * { id: 123, url: '/game', launchType: 2 }
 */
export const getParams = (
  dynamicKeys: string[] = ['tab'],
  search:
    | string
    | string[][]
    | Record<string, string>
    | URLSearchParams
    | undefined,
  state: { [x: string]: string | number | undefined }
): IDefaultParams => {
  const params: IDefaultParams = {};

  for (const key of dynamicKeys) {
    // 支援 QA 測試 接口 [eg: ../share?tab=0]
    const queryParam = new URLSearchParams(search).get(key);
    if (queryParam !== null) {
      params[key] = isNaN(Number(queryParam)) ? queryParam : Number(queryParam);
    }

    // 从 location.state 获取动态参数
    if (state && state[key] !== undefined) {
      params[key] = state[key];

      // 替換當前 state
      if (!window.history.state || window.history.state[key] !== state[key]) {
        // 替换当前历史状态，确保刷新时不丢失数据
        window.history.replaceState(
          { ...window.history.state, [key]: state[key] },
          '',
          location.pathname
        );
      }
    }
  }

  // 刷新
  if (window.history.state) {
    return {
      ...params,
      ...window.history.state,
    };
  }

  // console.log('@@@===> params', params);

  return params;
};

/**
 * 根據時間過濾數組 1天 7天 30天
 * @param data 數組對象
 * @param days 默認1天
 * @returns
 */
export const filterDataByDays = <T extends { timestamp: number }>(
  data: T[],
  days: number = 1
): T[] => {
  const now = Math.floor(Date.now() / 1000); // 当前时间的时间戳（秒）
  const cutoffTimestamp = now - days * 24 * 60 * 60; // 当前时间减去指定天数的时间戳（秒）

  return data.filter((item) => item.timestamp >= cutoffTimestamp);
};

/**
 * 獲取圖標擴展名稱
 * @param url
 * @returns
 */
export const getIconName = (url: string) => {
  if (!url) return url;
  // 使用字符串处理方法获取文件名（不含扩展名）
  const fileNameWithExt = url.split('/').pop(); // 获取最后一部分，即文件名和扩展名
  if (!fileNameWithExt) return url;
  const iconName = fileNameWithExt.split('.').shift(); // 去掉扩展名，获取文件名
  return iconName;
};

export const isNumeric = (str: string) => /^\d+$/.test(str);

/**
 * 阻止iOS自動放大
 * @param isFocus
 */
export const preventZoom = (isFocus: boolean) => {
  // const viewport = document.querySelector('meta[name=viewport]');
  const handleFocus = () => {
    const content =
      'width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1';
    // if (viewport) {
    //   viewport.setAttribute('content', content);
    // } else {
    // createViewportMeta(content);
    // }
    removeAllMetaElements();
    createViewportMeta(content);
  };

  const handleBlur = () => {
    const content = 'width=device-width, initial-scale=1, user-scalable=yes';
    // if (viewport) {
    //   viewport.setAttribute('content', content);
    // } else {
    // createViewportMeta(content);
    // }
    removeAllMetaElements();
    createViewportMeta(content);
  };

  const createViewportMeta = (content: string) => {
    const newViewport = document.createElement('meta');
    newViewport.name = 'viewport';
    newViewport.content = content;
    document.head.appendChild(newViewport);

    console.log('@@@===> preventZoom newViewport', newViewport);
  };

  // 在適當的時機移除所有 meta 元素
  const removeAllMetaElements = () => {
    const metaElements = document.querySelectorAll('meta[name=viewport]');
    metaElements.forEach((element) => {
      element.remove();
    });
  };

  // const resetZoom = (scale: string) => {
  //   document.documentElement.style.zoom = scale;
  // };

  if (isFocus) {
    handleFocus();
    // resetZoom('1');
  }

  if (!isFocus) {
    handleBlur();
    // resetZoom('1');
  }

  console.log(
    '@@@===> preventZoom dom',
    document.querySelector('meta[name=viewport]')
  );
};
/**
 * 將當前網址的子域名替換成 www
 */
export const replaceSubdomainWithWWW = () => {
  const url = new URL(window.location.href);
  const parts = url.hostname.split('.');

  const rootDomain = parts.slice(-2).join('.');
  window.location.protocol;
  const newUrl = `${window.location.protocol}//www.${rootDomain}`;

  // if (url.search) {
  //   newUrl += url.search;
  // }

  return newUrl;
};
