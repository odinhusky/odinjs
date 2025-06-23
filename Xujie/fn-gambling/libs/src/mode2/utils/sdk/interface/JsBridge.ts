import { AppSetting } from '@mode2/@types/appSettingType';
import { AppLaunchInfo } from '@mode2/@types/appLaunchInfoType';

export interface JsBridge {
  /**
   * 通知 native 已經初始成功
   */
  firstInitialSuccess(): void;

  /**
   * 获取渠道ID
   */
  getAppId(): string;

  /**
   * 获取包名
   */
  getAppName(): string;

  /**
   * 获取版本号
   */
  getAppVersionName(): string;

  /**
   * 浏览器打开网页
   * @param url
   */
  openBrowser(url: string, target?: string, features?: string): void;

  /**
   * 获取设备唯一ID
   */
  getDeviceID(): string;

  /**
   * 取得  Google ADID
   * @param retryCount
   * @param delay
   */
  getGoogleADID(retryCount: number, delay: number): Promise<string>; // retry *10

  /**
   * 取得 Adjust ADID
   * @param retryCount
   * @param delay
   */
  getAdjustADID(retryCount: number, delay: number): Promise<string>; // retry *10

  /**
   * 送出歸因事件
   * @param event
   * @param name
   */
  sendEvent(event: string, name?: string): void;

  /**
   * 是否強制更新
   */
  availableNewVersionApk(): boolean;

  /**
   * 是否有弱更新版本
   */
  availableLazyNewVersionApk(): boolean;

  /**
   * 設置原生JS交互 被動接收 function
   * [logEvent, logEventToH5, appDeepLink, appAdjustAttribution, appInstallApps]
   */
  setupNativePassiveInteractions(): void;

  /**
   * 需要 hook 所以使用 callback
   * 原生 appLink or deepLink 行為處理，與推廣深度連結 參數上報
   * @param callback
   */
  setupNativeDeepLink(
    callback: (path: string, queryString: string) => void
  ): void;

  /**
   * current Native One-Signal oneSignalId
   * @param callback
   */
  setupNativePushToken(callback: (oneSignalId: string) => void): void;

  /**
   * 嘗試喚醒原生android apk , ios app
   * @param schema
   * @param fallbackUrl
   */
  tryOpenAppFromSchema(schema: string, fallbackUrl: string): void;

  /**
   * 刷新頁面
   */
  reloadWindow(): void;

  /**
   * 更新未讀數
   */
  updateBadgeCount(badgeCount: number): void;

  /**
   * 新增帶有提醒功能的日立排程
   * @param datetime
   * @param message
   */
  addEventWithReminder(datetime: string, message: string): void;

  /**
   *   appId?: string; // 渠道 ID
   *   deviceId?: string; // apk  in app webview deviceID
   *   fbp?: string; // pixel
   *   fbc?: string; // pixel
   *   pixelId?: string; // pixel
   *   accessToken?: string; // pixel
   *
   *   // Facebook 動態URL占位符
   *   // 置入廣告動態網址參數
   *   adId?: string;
   *   adsetId?: string;
   *   campaignId?: string;
   *   adName?: string;
   *   adsetName?: string;
   *   campaignName?: string;
   *   placement?: string;
   *   siteSourceName?: string;
   */
  getAppSetting(): AppSetting | null;

  /**
   *   buildId?: string; // 動態包版 apk uuid
   *   buildTime?: number; // 動態包版時間 EventTypeBuild EventType = 0 // 打包
   *   firstInstallTime?: number; // EventTypeInstall EventType = 1 // 安装
   *   lastUpdateTime?: number; // EventTypeForceUpdateTime EventType = 4 // 强更时间
   *   firstLaunch?: number; // EventTypeLaunch EventType = 2 // 启动
   *   lastLaunch?: number;
   *   launchCount?: number;
   */
  getAppLaunchInfo(): AppLaunchInfo | null;

  /**
   * 是 deeplink 喚醒 app
   */
  isDeepLinkWakeUp(): boolean;

  /**
   * 從 廣告投放 deeplink 喚醒 app
   */
  getDeepLinkAppSetting(): AppSetting | null;
}
