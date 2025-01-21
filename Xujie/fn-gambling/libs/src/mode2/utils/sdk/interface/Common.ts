import { ILogPayload } from '@commonUtils/eventLog/ICommand';

export interface Common {
  init(): void;

  initAfter(): void;

  productName(): string;
  
  countryName(): string;

  getH5VersionName(): string;

  /**
   * 初始sdk 就檢查是否支援  webp
   */
  initCheckWebPSupport(): void;

  /**
   * 檢查當前 H5 version
   */
  checkVersionUpdate(): void;

  /**
   * 是否在 android apk 內
   * 是否在 ios ipa 內
   */
  isInNative(): boolean;

  /**
   * 生成13碼
   */
  generateUniqueNumber(length: number): string;

  /**
   * 音效播放
   */
  playSound(): void;

  /**
   * get operating system
   */
  getOs(): string;

  /**
   * 判断是否为iOS内核
   * @returns {boolean} 如果是iOS内核返回true，否则返回false
   */
  isIOSKernel(): boolean;

  /**
   * 判断是否为Android内核
   * @returns {boolean} 如果是Android内核返回true，否则返回false
   */
  isAndroidKernel(): boolean;

  /**
   * 判断是否为Edge浏览器
   * @returns {boolean} 如果是Edge浏览器返回true，否则返回false
   */
  isEdge(): boolean;

  /**
   * 判断是否为Safari浏览器
   * @returns {boolean} 如果是Safari浏览器返回true，否则返回false
   */
  isSafari(): boolean;

  /**
   * 判断是否为Chrome浏览器
   * @returns {boolean} 如果是Chrome浏览器返回true，否则返回false
   */
  isChrome(): boolean;

  /**
   * 判断是否为Windows操作系统
   * @returns {boolean} 如果是Windows操作系统返回true，否则返回false
   */
  isWindows(): boolean;

  /**
   * 判断是否为MacOS操作系统
   * @returns {boolean} 如果是MacOS操作系统返回true，否则返回false
   */
  isMacOS(): boolean;

  /**
   * 判断是否为Linux操作系统
   * @returns {boolean} 如果是Linux操作系统返回true，否则返回false
   */
  isLinux(): boolean;

  /**
   * 判断PWA是否已安装
   * @returns {boolean} 如果PWA已安装返回true，否则返回false
   */
  isPwaInstalled(): boolean;

  loggerClientSendEvent(payload: ILogPayload): void;
}
