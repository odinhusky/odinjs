import { Common } from '../interface/Common';
import { FetchMyIp } from '@libs/commonUtils';
import { checkWebPSupport } from '@mode2/utils/sdk/strategy/checkWebPSupport';
import { clickSound } from '@mode2/media/clickSound';
import { checkH5VersionUpdate } from '@mode2/utils/sdk/strategy/checkH5VersionUpdate';
import { LoggerClient } from '@commonUtils/eventLog/LoggerClient';
import { ILogPayload } from '@commonUtils/eventLog/ICommand';

const getFormattedCurrentDateTime = (): string => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Monate sind 0-basiert, daher +1 und dann mit slice(-2) umformatieren
  const day = ('0' + currentDate.getDate()).slice(-2);
  const hours = ('0' + currentDate.getHours()).slice(-2);
  const minutes = ('0' + currentDate.getMinutes()).slice(-2);
  const seconds = ('0' + currentDate.getSeconds()).slice(-2);
  const milliseconds = ('00' + currentDate.getMilliseconds()).slice(-3);
  return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
};

const replaceToDigits = (
  length: number,
  randomPart: string,
  str: string
): string => {
  let result = 1;
  for (let i = 0; i < str.length; i++) {
    const digit = parseInt(str[i], 10); // Convert character to number
    if (!isNaN(digit)) {
      // Check if it's a valid number
      result *= digit; // Multiply the digits together
    }
  }
  const resultStr = result.toString();
  const defective = length - resultStr.length;
  const randomStartIndex = Math.floor(
    Math.random() * (randomPart.length - defective + 1)
  );
  const prefixNumbers = randomPart.substr(randomStartIndex, defective);
  return prefixNumbers + resultStr;
};

/**
 * 比較版本號工具
 * @param current
 * @param target
 * @returns {boolean}
 */
export const compareVersions = (current: string, target: string): boolean => {
  // 解析版本號為數組
  const parseVersion = (version: string) => {
    return version.split('.').map((num) => num.padStart(3, '0'));
  };
  // 填充數組使其長度一致
  const padVersionArray = (arr: string[], length: number) => {
    while (arr.length < length) {
      arr.unshift('000');
    }
    return arr;
  };

  const currentParts = parseVersion(current);
  const targetParts = parseVersion(target);
  const maxLength = Math.max(currentParts.length, targetParts.length);
  padVersionArray(currentParts, maxLength);
  padVersionArray(targetParts, maxLength);

  for (let i = 0; i < Math.max(currentParts.length, targetParts.length); i++) {
    const currentPart = parseInt(currentParts[i] || '000', 10);
    const targetPart = parseInt(targetParts[i] || '000', 10);

    if (targetPart > currentPart) {
      return true; // 目標版本大於當前版本
    } else if (targetPart < currentPart) {
      return false; // 目標版本小於當前版本
    }
  }
  return false; // 版本號相同或目標版本小於當前版本
};
const loggerClient = new LoggerClient();
export const CommonStrategy: Common = {
  init(): void {
    FetchMyIp.doFetchMyIp();
    this.initCheckWebPSupport();
    this.initAfter();
  },

  initAfter(): void {},

  productName(): string {
    return import.meta.env['VITE_PLATFORM'] || '';
  },

  countryName(): string {
    const code: string = import.meta.env['VITE_COUNTRY_CODE'];
    const name: { [key: string]: string } = {
      IN: 'India',
      PK: 'Pakistan',
      BD: 'Bangladesh',
    };
    return name[code] || '';
  },

  getH5VersionName(): string {
    return import.meta.env['VITE_VERSION'] || '1.00.00';
  },

  initCheckWebPSupport() {
    return checkWebPSupport();
  },

  checkVersionUpdate() {
    return checkH5VersionUpdate();
  },

  // Common
  isInNative(): boolean {
    return false;
  },

  /**
   * 生成唯一碼
   */
  generateUniqueNumber(length: number): string {
    const timestamp = getFormattedCurrentDateTime().replace(/0/g, '1');
    let randomPart = '';
    while (randomPart.length < length) {
      const digit = Math.floor(Math.random() * 9) + 1; // Zufällige Ziffer zwischen 1 und 9
      randomPart += digit.toString();
    }
    const result = replaceToDigits(length, randomPart, timestamp);
    return result;
  },

  /**
   * 播放點擊音效
   */
  playSound() {
    if (clickSound.paused) {
      clickSound.currentTime = 0; // 重新开始播放
      clickSound.play().catch((error) => {
        console.log('Failed to play:', error);
      });
    }
  },

  /**
   * get operating system
   */
  getOs(): string {
    return '';
  },

  /**
   * 判断是否为iOS内核
   * @returns {boolean} 如果是iOS内核返回true，否则返回false
   */
  isIOSKernel(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  },
  /**
   * 判断是否为Android内核
   * @returns {boolean} 如果是Android内核返回true，否则返回false
   */
  isAndroidKernel(): boolean {
    return /Android/.test(navigator.userAgent);
  },
  /**
   * 判断是否为Edge浏览器
   * @returns {boolean} 如果是Edge浏览器返回true，否则返回false
   */
  isEdge(): boolean {
    return /Edg/.test(navigator.userAgent);
  },
  /**
   * 判断是否为Safari浏览器
   * @returns {boolean} 如果是Safari浏览器返回true，否则返回false
   */
  isSafari(): boolean {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  },
  /**
   * 判断是否为Chrome浏览器
   * @returns {boolean} 如果是Chrome浏览器返回true，否则返回false
   */
  isChrome(): boolean {
    return (
      /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
    );
  },
  /**
   * 判断是否为Windows操作系统
   * @returns {boolean} 如果是Windows操作系统返回true，否则返回false
   */
  isWindows(): boolean {
    return /Win/.test(navigator.platform);
  },
  /**
   * 判断是否为MacOS操作系统
   * @returns {boolean} 如果是MacOS操作系统返回true，否则返回false
   */
  isMacOS(): boolean {
    return /Mac/.test(navigator.platform);
  },
  /**
   * 判断是否为Linux操作系统
   * @returns {boolean} 如果是Linux操作系统返回true，否则返回false
   */
  isLinux(): boolean {
    return /Linux/.test(navigator.platform);
  },
  /**
   * 判断PWA是否已安装
   * @returns {boolean} 如果PWA已安装返回true，否则返回false
   */
  isPwaInstalled(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone ||
      document.referrer.includes('android-app://')
    );
  },
  loggerClientSendEvent(payload: ILogPayload): void {
    loggerClient.logEvent(payload);
  },

  isDevelopDebug(): boolean {
    return import.meta.env['VITE_MODE'] !== 'prod';
  },
};
