import dayjs from 'dayjs';
import { EResourceLevel, getImgUrl } from '@mode2/utils/img';
import sdkUtils from '@mode2/utils/sdk';
// import { InputProps } from '@libs/components/Input';
import tailwindVariables from '@libs/plugins/tailwindcss/tailwind.variables';
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
    document.documentElement.style.fontSize = `${
      window.innerWidth < phonePoint ? window.innerWidth / (375 / 16) : 16
    }px`;
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
    document.documentElement.style.backgroundColor =
      'var(--transparent-gray-90)';
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

const countryCode = import.meta.env['VITE_COUNTRY_CODE'];
const locale = `en-${countryCode}`;

/**
 * 格式化金額字串
 *
 * 處理貨幣符號顯示,千分位顯示方式,小數點後保留位數, 小數點保留位數後四捨五入
 * @param num - 需要格式化的数值
 * @param includeDecimal - 是否顯示小數部分(default false)
 * @param decimals - 保留幾位小数（default 2）
 * @returns 如'₹4,001' 或 '₹4001.00' 或 '₨1,234,567.89' 或 '₨1,234,567'
 */
export const formatMoney = (
  num: number,
  includeDecimal: boolean = false,
  decimals: number = 2
): string => {
  const countryCurrency = import.meta.env['VITE_COUNTRY_CURRENCY'];

  return num.toLocaleString(locale, {
    style: 'currency',
    currency: countryCurrency,
    minimumFractionDigits: includeDecimal ? decimals : 0, // 保留的最小小數位數。如果数字的小数部分不足该位數，則補0
    maximumFractionDigits: includeDecimal ? decimals : 0, // 保留的最大小數位數。超出部分将被捨去（四捨五入）。
  });
};

/**
 * 格式化數字字串
 *
 * 處理千分位顯示方式,小數點後保留位數, 小數點保留位數後四捨五入
 * @param num - 需要格式化的数值
 * @param includeDecimal - 是否顯示小數部分
 * @returns 如'123,004' 或 '123,004.00'
 */
export const formatNumber = (
  num: number,
  includeDecimal: boolean = false,
  decimals: number = 2
) => {
  return num.toLocaleString(locale, {
    minimumFractionDigits: includeDecimal ? decimals : 0, // 保留的最小小數位數。如果数字的小数部分不足该位數，則補0
    maximumFractionDigits: includeDecimal ? decimals : 0, // 保留的最大小數位數。超出部分將被捨去（四捨五入）。
  });
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
  timestamp: number,
  format: string = 'DD.MM.YYYY HH:mm'
) => {
  // dayjs默認接受毫秒
  const date = dayjs(timestamp * 1000).format(format);
  return date;
};

/**
 * 剩余时间格式化
 *
 * @param timestamp - 時間戳(秒)
 * @example
 */
export const formatCountdownTime: (timestamp: number) => string = (
  timestamp
) => {
  const hour = Math.floor(timestamp / 3600);
  const minutes = Math.floor(timestamp / 60) - hour * 60;
  const seconds = timestamp % 60;
  return `${hour ? hour.toString().padStart(2, '0') + ':' : ''}${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
 *
 * @param str
 * @param digits
 * @param star
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
  state: { [x: string]: string | number | undefined },
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
