import { JsBridge } from '../interface/JsBridge';
import { Storage } from '../interface/Storage';
import { CommonStrategy } from './CommonStrategy';
import { Common } from '../interface/Common';
import { DESCryptoStrategy } from './DESCryptoStrategy';
import { DESCrypto } from '../interface/DESCrypto';
import Fingerprint from '@libs/commonUtils/fingerprint';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import { AnalyticsProviders } from '@mode2/utils/sdk/interface/AnalyticsProviders';
import { AdjustEventKey } from '@mode2/utils/sdk/persistant/adjust/AdjustEventKey';
import { useAdjustEventTokensStore } from '@mode2/zustand/platform/adjustEventTokensStore';
import {
  SentryAnalytics,
  SentryErrorPayload,
  SentryEventPayload,
} from '@mode2/utils/sdk/strategy/analytics/SentryAnalytics';
import {
  AdjustAnalytics,
  AdjustErrorPayload,
  AdjustEventPayload,
} from '@mode2/utils/sdk/strategy/analytics/AdjustAnalytics';
import {
  SensorsAnalytics,
  SensorsEventPayload,
} from '@mode2/utils/sdk/strategy/analytics/SensorsAnalytics';
import {
  IErrorPayload,
  IEventPayload,
} from '@mode2/utils/sdk/interface/Analytics';
import { Push, PushExtra } from '@mode2/utils/sdk/interface/Push';
import { MessagePayload, Unsubscribe } from 'firebase/messaging';
// import { FirebasePush } from '@mode2/utils/sdk/strategy/push/FirebasePush';
import { OneSignalPush } from '@mode2/utils/sdk/strategy/push/OneSignalPush';

import isEmpty from 'lodash/isEmpty';
import has from 'lodash/has';
import {
  SaleSmartlyChat,
  SaleSmartlyUserProfile,
} from '@mode2/utils/sdk/strategy/onlineService/SaleSmartlyChart';
import { OnlineServiceProvide } from '@mode2/utils/sdk/interface/OnlineServiceProvide';
import { State } from '@mode2/utils/sdk/interface/State';
import { WebLocalStorage } from '@libs/commonUtils/localStorage';
import { useAppStore } from '@mode2/zustand/appStore';
import console from 'node:console';
import { usePlatformDynamicConfigStore } from '@mode2/zustand/platform/platformDynamicConfig';
import {
  PostHogAnalytics,
  PostHogEventPayload,
} from '@mode2/utils/sdk/strategy/analytics/PostHogAnalytics';
import { AppSetting } from '@mode2/@types/appSettingType';
import { AppLaunchInfo } from '@mode2/@types/appLaunchInfoType';

const webLocalStorage = new WebLocalStorage<AppLocalStorageKey>();
export const WebStrategy: Common &
  DESCrypto &
  JsBridge &
  Storage &
  AnalyticsProviders &
  Push<MessagePayload, Unsubscribe | undefined, PushExtra> &
  OnlineServiceProvide<SaleSmartlyUserProfile> &
  State = {
  // State
  isCurrentLogin(): boolean {
    return !isEmpty(this.getStorage(AppLocalStorageKey.TOKEN));
  },

  // Common
  ...CommonStrategy,

  getWebDeviceId(): string {
    return '';
  },

  downloadApp(query?: Record<string, any>): void {
    const queryData = {
      appId: import.meta.env['VITE_V_VERSION'] === 'v6' ? '6007001' : '',
      deviceId:
        import.meta.env['VITE_V_VERSION'] === 'v6' ? this.getDeviceID() : '',
      ...(query ? query : {}),
    };

    // 過濾空字串與 undefined、null 的屬性
    const filtered = Object.fromEntries(
      Object.entries(queryData).filter(
        ([k, v]) => v !== '' && v !== undefined && v !== null
      )
    );
    const queryString = new URLSearchParams(filtered).toString();
    const fullQueryString = queryString ? '?' + queryString : '';
    const url = `${import.meta.env['VITE_DOWNLOAD_APK_URL']}${fullQueryString}`;
    console.log('@@@===>downloadApp', url);
    this.openBrowser(url, '_blank');
  },

  wakeUpOrDownloadApp(query?: Record<string, any>): void {
    const queryData = {
      appId: import.meta.env['VITE_V_VERSION'] === 'v6' ? '6007001' : '',
      deviceId:
        import.meta.env['VITE_V_VERSION'] === 'v6' ? this.getDeviceID() : '',
      ...(query ? query : {}),
    };

    // 過濾空字串與 undefined、null 的屬性
    const filtered = Object.fromEntries(
      Object.entries(queryData).filter(
        ([k, v]) => v !== '' && v !== undefined && v !== null
      )
    );
    const queryString = new URLSearchParams(filtered).toString();
    const fullQueryString = queryString ? '?' + queryString : '';

    // 不是android 內核，無法走deeplink 喚醒
    if (this.isIOSKernel() || this.isMacOS() || this.isWindows()) {
      this.downloadApp(query);
      return;
    }

    // const packageName = import.meta.env['VITE_ADJUST_PACKAGE_NAME'];
    const platform = import.meta.env['VITE_PACKAGENAME'];
    // const scheme = `my${platform}`;
    // const intent = `//app/hall${fullQueryString}`;
    //
    // const fallbackUrl = `${
    //   import.meta.env['VITE_DOWNLOAD_APK_URL']
    // }${fullQueryString}`;
    // const intentUrl = `intent:${intent}#Intent;scheme=${scheme};package=${packageName};S.browser_fallback_url=${encodeURIComponent(
    //   fallbackUrl
    // )};end;`;
    // console.log('@@@===>wakeUpOrDownloadApp', intentUrl);
    // window.location.href = intentUrl;

    const deppLink = `my${platform}://app/hall${fullQueryString}&wake_up_from=website`;
    let link = `https://dl.7ind.com/dl/rd2`;
    link += '?deep_link=' + encodeURIComponent(deppLink);
    link +=
      '&redirect=' +
      encodeURIComponent(`https://dl.7ind.com/dl/latest.apk${fullQueryString}`);
    console.log('@@@===> wakeUpOrDownloadApp', link);
    this.openBrowser(link);
    // window.location.href = link;
  },

  getAppReferralCode(): string | null {
    return null;
  },

  initAfter(): void {
    this.analyticsInits();
    this.initPush();
    this.initChat();
    this.initCheckWebPSupport();
    this.initCheckAvifSupport();
    this.setupNativeDeepLink((path, queryString) => {});
  },

  // Push
  // ...FirebasePush,
  ...OneSignalPush,

  // online service provide
  ...SaleSmartlyChat,

  /**
   * user_id 交給 sdk定義，是為了確保同環境登入登出，訪客變使用者，都能夠保留聊天記錄。
   * @param profile
   * @description overwrite SaleSmartlyChat.setUserChatProfile()
   */
  setUserChatProfile(profile: SaleSmartlyUserProfile): void {
    if (this.isSupportThirdPartyChat() && window.ssq) {
      const packageName = import.meta.env['VITE_PACKAGENAME'];
      const userLabel = isEmpty(this.getStorage(AppLocalStorageKey.TOKEN))
        ? 'isGuest'
        : 'isUser';
      window.ssq.push('setLoginInfo', {
        user_id: this.encryption(`${packageName}_${this.getDeviceID()}`), // 加密后的用户id, 必填！
        user_name: profile.userName,
        description: profile.description,
        label_names: [userLabel, `${packageName}`, ...profile.labelNames],
      });
    }
  },

  // SupportAnalytics
  analyticsInits(): void {
    SensorsAnalytics.init();
    SentryAnalytics.init();
    AdjustAnalytics.init();
    PostHogAnalytics.init();

    // for web  Adjust.Attribution
    AdjustAnalytics.extra.getAttribution().then((attribution) => {
      if (attribution) {
        const clickLabel =
          attribution.click_label ||
          ''.split('__').reduce((acc: any, pair: any) => {
            const [key, value] = pair.split('_');
            acc[key] = value;
            return acc;
          }, {});

        // 拿出 promoteGameId
        const promoteGameId = Number(clickLabel['promoteGameId'] || '-1');
        const referralCode = clickLabel['referralCode'] || '';
        console.log(
          '@@@===> PWA AdjustAttribution.clickLabel',
          JSON.stringify(clickLabel, null, 2)
        );

        if (referralCode !== '') {
          useAppStore.getState().setTemporaryReferralCode(referralCode);
          this.setStorage(AppLocalStorageKey.REFERRAL_CODE, referralCode);
        }
        if (promoteGameId > 0) {
          this.setStorage(
            AppLocalStorageKey.PROMOTE_GAME_ID,
            `${promoteGameId}`
          );
          usePlatformDynamicConfigStore
            .getState()
            .setPromoteGameIds([promoteGameId]);
        }
      }
    });
  },

  sendAnalyticsEvent<T extends IEventPayload>(payload: T): void {
    try {
      if (has(payload, 'postHogType')) {
        PostHogAnalytics.sendEvent(payload as unknown as PostHogEventPayload);
      }
      if (has(payload, 'sentryType')) {
        SentryAnalytics.sendEvent(payload as unknown as SentryEventPayload);
      }
      if (has(payload, 'eventToken')) {
        AdjustAnalytics.sendEvent(payload as unknown as AdjustEventPayload);
      }
      if (has(payload, 'sensorsType')) {
        SensorsAnalytics.sendEvent(payload as unknown as SensorsEventPayload);
      }
    } catch (error) {
      console.log('===> error', error);
    }
  },

  sendAnalyticsError<T extends IErrorPayload>(payload: T): void {
    if (has(payload, 'exception')) {
      SentryAnalytics.sendError(payload as unknown as SentryErrorPayload);
    }
    if (has(payload, 'logLevel')) {
      AdjustAnalytics.sendError(payload as unknown as AdjustErrorPayload);
    }
  },

  /**
   * overwrite Common.getOs()
   */
  getOs(): string {
    return 'web';
  },

  /**
   * SCrypto
   */
  ...DESCryptoStrategy,

  // JsBridge
  firstInitialSuccess(): void {},

  getAppId(): string {
    return import.meta.env['VITE_CHANNEL_ID'];
  },

  getAppName(): string {
    return import.meta.env['VITE_ADJUST_PACKAGE_NAME'];
  },

  getAppVersionName(): string {
    return '';
  },

  openBrowser(url: string, target?: string, features?: string): void {
    window.open(url, target, features);
  },

  getDeviceID(): string {
    return Fingerprint.get();
  },

  getGoogleADID(): Promise<string> {
    return Promise.resolve('');
  },

  getAdjustADID(): Promise<string> {
    return Promise.resolve('');
  },

  sendEvent(event: AdjustEventKey, name: string = ''): void {
    const eventTokens = useAdjustEventTokensStore.getState().eventTokens;
    const eventToken = eventTokens.find(
      (item) => event.toLowerCase() === item.event.toLowerCase()
    )?.token;
    if (eventToken !== undefined && eventToken !== '') {
      this.sendAnalyticsEvent<AdjustEventPayload>({
        eventToken: eventToken,
        event: event,
        name: name,
      });
    } else {
      this.sendAnalyticsError<SentryErrorPayload>({
        exception: 'web adjust event tokens is not found',
      });
    }
  },

  availableNewVersionApk(): boolean {
    return false;
  },

  availableLazyNewVersionApk(): boolean {
    return false;
  },

  setupNativePassiveInteractions(): void {},

  setupNativeDeepLink(
    callback: (path: string, queryString: string) => void
  ): void {
    window.webDeepLink = async (path: string, queryString?: string) => {
      callback(path, queryString || '');
    };
  },

  setupNativePushToken(): void {},

  tryOpenAppFromSchema(schema: string, fallbackUrl: string): void {
    window.open(fallbackUrl);
    // const openTime = dayjs().unix();
    // let timer: NodeJS.Timeout | null = null;
    // let opened = false;
    // window.location.href = schema;
    // timer = setTimeout(() => {
    //   if (dayjs().unix() - openTime < 3 && !opened) {
    //     window.open(fallbackUrl);
    //   }
    //   clearTimeout(timer!);
    // }, 1000);
    //
    // // 检查浏览器是否支持 `visibilityState`
    // if (typeof document.visibilityState !== 'undefined') {
    //   // 页面可见性状态变化事件监听
    //   const handleVisibilityChange = () => {
    //     if (document.visibilityState === 'hidden') {
    //       console.log(
    //         '@@@===> document.visibilityState:',
    //         document.visibilityState
    //       );
    //       opened = true; // 用户成功离开页面，表示应用可能已被唤醒
    //       document.removeEventListener(
    //         'visibilitychange',
    //         handleVisibilityChange
    //       );
    //     }
    //   };
    //
    //   document.addEventListener('visibilitychange', handleVisibilityChange);
    // } else {
    //   console.log('Page Visibility API not supported.');
    // }
  },

  reloadWindow(): void {
    const { lastModified, eTag } = useAppStore.getState().realTimeH5Version;
    if (lastModified) {
      this.setStorage(AppLocalStorageKey.H5_LAST_MODIFIED, lastModified);
    }
    if (eTag) {
      this.setStorage(AppLocalStorageKey.H5_LAST_ETAG, eTag);
    }
    window.location.reload();
  },

  updateBadgeCount(badgeCount: number): void {
    const count = badgeCount >= 0 ? badgeCount : 0;
    this.setStorage(AppLocalStorageKey.BADGER_COUNT, `${count}`);
  },

  addEventWithReminder(datetime: string, message: string): void {},

  getAppSetting(): AppSetting | null {
    return null;
  },

  getAppLaunchInfo(): AppLaunchInfo | null {
    return null;
  },

  isDeepLinkWakeUp(): boolean {
    return false;
  },

  getDeepLinkAppSetting(): AppSetting | null {
    return null;
  },

  getStorage: webLocalStorage.getStorage,
  setStorage: webLocalStorage.setStorage,
  removeStorage: webLocalStorage.removeStorage,
};
