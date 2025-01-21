import { JsBridge } from '../interface/JsBridge';
import { Storage } from '../interface/Storage';
import { CommonStrategy, compareVersions } from './CommonStrategy';
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
  SensorsAnalytics,
  SensorsEventPayload,
} from '@mode2/utils/sdk/strategy/analytics/SensorsAnalytics';
import {
  IErrorPayload,
  IEventPayload,
} from '@mode2/utils/sdk/interface/Analytics';
import { Push, PushExtra } from '@mode2/utils/sdk/interface/Push';
import { NonePush } from '@mode2/utils/sdk/strategy/push/NonePush';
import { MessagePayload, Unsubscribe } from 'firebase/messaging';
import { has, isEmpty } from 'lodash';
import {
  SaleSmartlyChat,
  SaleSmartlyUserProfile,
} from '@mode2/utils/sdk/strategy/onlineService/SaleSmartlyChart';
import { OnlineServiceProvide } from '@mode2/utils/sdk/interface/OnlineServiceProvide';
import { State } from '@mode2/utils/sdk/interface/State';
import { useAppStore } from '@mode2/zustand/appStore';

export const IosStrategy: Common &
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

  initAfter(): void {
    this.analyticsInits();
    this.initPush();
    this.initChat();
    this.initCheckWebPSupport();
  },

  // Push
  ...NonePush,

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

  analyticsInits: () => {
    SensorsAnalytics.init();
    SentryAnalytics.init();
  },

  sendAnalyticsEvent<T extends IEventPayload>(payload: T): void {
    try {
      if (has(payload, 'sentryType')) {
        SentryAnalytics.sendEvent(payload as unknown as SentryEventPayload);
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
  },

  /**
   * overwrite Common.isInNative()
   */
  isInNative(): boolean {
    return true;
  },

  /**
   * overwrite Common.getOs()
   */
  getOs(): string {
    return 'ios';
  },

  /**
   * SCrypto
   */
  ...DESCryptoStrategy,

  // JsBridge
  firstInitialSuccess(): void {
    window.ios.firstInitialSuccess();
  },

  getAppId(): string {
    return window.ios.getChannelID();
  },

  getAppName(): string {
    return window.ios.getAppName();
  },

  getAppVersionName(): string {
    return window.ios.getAppVersionName();
  },

  openBrowser(url: string): void {
    window.ios.openBrowser(url);
  },

  getDeviceID(): string {
    if (window.ios.getDeviceID) {
      return window.ios.getDeviceID() || Fingerprint.get();
    }
    return Fingerprint.get();
  },

  getGoogleADID(retryCount: number = 10, delay: number = 500): Promise<string> {
    return new Promise((resolve) => {
      const attempt = (retriesLeft: number) => {
        const gAdId = window.ios.getGoogleADID();
        if (gAdId) {
          resolve(gAdId);
        } else if (retriesLeft > 0) {
          setTimeout(() => {
            attempt(retriesLeft - 1);
          }, delay);
        } else {
          resolve(''); // 或者使用 reject(new Error("Failed to get Google ADID"));
        }
      };
      attempt(retryCount);
    });
  },

  getAdjustADID(retryCount: number = 10, delay: number = 500): Promise<string> {
    return new Promise((resolve) => {
      const attempt = (retriesLeft: number) => {
        const adId = window.ios.getadjustADID();
        if (adId) {
          resolve(adId);
        } else if (retriesLeft > 0) {
          setTimeout(() => {
            attempt(retriesLeft - 1);
          }, delay);
        } else {
          resolve(''); // 或者使用 reject(new Error("Failed to get Google ADID"));
        }
      };
      attempt(retryCount);
    });
  },
  sendEvent(event: AdjustEventKey, name: string = ''): void {
    const eventTokens = useAdjustEventTokensStore.getState().eventTokens;
    const eventToken = eventTokens.find(
      (item) => event.toLowerCase() === item.event.toLowerCase()
    )?.token;
    if (eventToken !== undefined && eventToken !== '') {
      window.ios.AdjustEvent(eventToken, event, name);
    } else {
      this.sendAnalyticsError<SentryErrorPayload>({
        exception: 'web adjust event tokens is not found',
      });
    }
  },

  availableNewVersionApk(): boolean {
    const targetVersion = import.meta.env['VITE_TARGET_APK_VERSION_NAME'];
    const versionName = this.getAppVersionName();
    return compareVersions(versionName, targetVersion);
  },

  availableLazyNewVersionApk(): boolean {
    if (this.availableNewVersionApk()) {
      return false;
    }
    const targetLazyVersion = import.meta.env['VITE_LAZY_APK_VERSION_NAME'];
    const versionName = this.getAppVersionName();
    return compareVersions(versionName, targetLazyVersion);
  },

  setupNativePassiveInteractions(): void {},

  setupNativeDeepLink(): void {},

  setupNativePushToken(): void {},

  tryOpenAppFromSchema(schema: string, fallbackUrl: string): void {
    window.ios.openAppOrBrowser(schema, fallbackUrl);
  },

  reloadWindow(): void {
    if (window.ios.restartApp) {
      const { lastModified, eTag } = useAppStore.getState().realTimeH5Version;
      if (lastModified) {
        this.setStorage(AppLocalStorageKey.H5_LAST_MODIFIED, lastModified);
      }
      if (eTag) {
        this.setStorage(AppLocalStorageKey.H5_LAST_ETAG, eTag);
      }
      window.ios.restartApp();
    }
  },

  updateBadgeCount(badgeCount: number): void {
    const count = badgeCount >= 0 ? badgeCount : 0;
    this.setStorage(AppLocalStorageKey.BADGER_COUNT, `${count}`);
    window.ios.updateNotificationBadge();
  },

  // Storage
  getStorage(key: AppLocalStorageKey): string | null {
    return window.ios.getAppStorage(key);
  },

  setStorage(key: AppLocalStorageKey, value: string): void {
    window.ios.setAppStorage(key, value);
  },

  removeStorage(key: AppLocalStorageKey): void {
    window.ios.setAppStorage(key, null);
  },
};
