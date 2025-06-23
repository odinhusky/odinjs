import { JsBridge } from '../interface/JsBridge';
import { Storage } from '../interface/Storage';
import { CommonStrategy, compareVersions } from './CommonStrategy';
import { Common } from '../interface/Common';
import { DESCryptoStrategy } from './DESCryptoStrategy';
import { DESCrypto } from '../interface/DESCrypto';
import Fingerprint from '@libs/commonUtils/fingerprint';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import { AnalyticsProviders } from '@mode2/utils/sdk/interface/AnalyticsProviders';
import { useAdjustEventTokensStore } from '@mode2/zustand/platform/adjustEventTokensStore';
import {
  SentryAnalytics,
  SentryErrorPayload,
  SentryEventPayload,
} from '@mode2/utils/sdk/strategy/analytics/SentryAnalytics';
import { AdjustEventKey } from '@mode2/utils/sdk/persistant/adjust/AdjustEventKey';
import {
  SensorsAnalytics,
  SensorsEventLabel,
  SensorsEventPayload,
  SensorsPayloadType,
} from '@mode2/utils/sdk/strategy/analytics/SensorsAnalytics';
import {
  IErrorPayload,
  IEventPayload,
} from '@mode2/utils/sdk/interface/Analytics';
import { Push, PushExtra } from '@mode2/utils/sdk/interface/Push';
import { NonePush } from '@mode2/utils/sdk/strategy/push/NonePush';
import { MessagePayload, Unsubscribe } from 'firebase/messaging';
import isEmpty from 'lodash/isEmpty';
import has from 'lodash/has';
import {
  SaleSmartlyChat,
  SaleSmartlyUserProfile,
} from '@mode2/utils/sdk/strategy/onlineService/SaleSmartlyChart';
import { OnlineServiceProvide } from '@mode2/utils/sdk/interface/OnlineServiceProvide';
import dayjs from '@commonUtils/localizedDayjs';
import { State } from '@mode2/utils/sdk/interface/State';
import * as console from 'node:console';
import { sensorsDataReportStore } from '@mode2/localforage/stroe';
import { useAppStore } from '@mode2/zustand/appStore';
import { usePlatformDynamicConfigStore } from '@mode2/zustand/platform/platformDynamicConfig';
import {
  PostHogAnalytics,
  PostHogEventPayload,
} from '@mode2/utils/sdk/strategy/analytics/PostHogAnalytics';
import { AppSetting } from '@mode2/@types/appSettingType';
import { AppLaunchInfo } from '@mode2/@types/appLaunchInfoType';

export const AndroidStrategy: Common &
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

  downloadApp(query?: Record<string, any>): void {},

  getAppReferralCode(): string | null {
    const setting = this.getAppSetting();
    if (
      ['pop'].includes(setting?.downloadFrom || '') &&
      setting?.referralCode
    ) {
      return setting.referralCode.toUpperCase();
    } else {
      return null;
    }
  },

  initAfter(): void {
    this.analyticsInits();
    this.initPush();
    this.initChat();
    this.setupNativePassiveInteractions();
    this.initCheckWebPSupport();
    this.initCheckAvifSupport();

    // 預先交互，獲取 gaid, adid
    this.getGoogleADID(10, 500);
    this.getAdjustADID(10, 500);
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

  // SupportAnalytics
  analyticsInits: () => {
    SensorsAnalytics.init();
    SentryAnalytics.init();
    PostHogAnalytics.init();
  },

  sendAnalyticsEvent<T extends IEventPayload>(payload: T): void {
    try {
      if (has(payload, 'postHogType')) {
        PostHogAnalytics.sendEvent(payload as unknown as PostHogEventPayload);
      }
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
    return 'android';
  },

  /**
   * SCrypto
   */
  ...DESCryptoStrategy,

  // JsBridge
  firstInitialSuccess(): void {
    if (window.android.firstInitialSuccess) {
      window.android.firstInitialSuccess();
    }
  },

  getAppId(): string {
    if (window.android.getChannelID) {
      return window.android.getChannelID();
    } else {
      return import.meta.env['VITE_CHANNEL_ID'];
    }
  },

  getAppName(): string {
    if (window.android.getAppName) {
      return window.android.getAppName();
    } else {
      return '';
    }
  },

  getAppVersionName(): string {
    if (window.android.getAppVersionName) {
      return window.android.getAppVersionName();
    } else {
      return '';
    }
  },

  openBrowser(url: string): void {
    if (window.android.openBrowser) {
      window.android.openBrowser(url);
    }
  },

  getDeviceID(): string {
    if (window.android.getDeviceID) {
      return window.android.getDeviceID() || Fingerprint.get();
    }
    return Fingerprint.get();
  },

  getGoogleADID(retryCount: number = 10, delay: number = 500): Promise<string> {
    return new Promise((resolve) => {
      const attempt = (retriesLeft: number) => {
        if (window.android.getGoogleADID) {
          const gAdId = window.android.getGoogleADID();
          if (gAdId) {
            useAppStore.getState().setGoogleADID(gAdId);
            resolve(gAdId);
          } else if (retriesLeft > 0) {
            setTimeout(() => {
              attempt(retriesLeft - 1);
            }, delay);
          } else {
            resolve(''); // 或者使用 reject(new Error("Failed to get Google ADID"));
          }
        } else {
          resolve('');
        }
      };
      attempt(retryCount);
    });
  },

  getAdjustADID(retryCount: number = 10, delay: number = 500): Promise<string> {
    return new Promise((resolve) => {
      const attempt = (retriesLeft: number) => {
        if (window.android.getadjustADID) {
          const adId = window.android.getadjustADID();
          if (adId) {
            useAppStore.getState().setAdjustADID(adId);
            resolve(adId);
          } else if (retriesLeft > 0) {
            setTimeout(() => {
              attempt(retriesLeft - 1);
            }, delay);
          } else {
            resolve(''); // 或者使用 reject(new Error("Failed to get Google ADID"));
          }
        } else {
          resolve('');
        }
      };
      attempt(retryCount);
    });
  },
  sendEvent(event: AdjustEventKey, name: string = ''): void {
    const eventTokens = useAdjustEventTokensStore.getState().eventTokens;
    // const eventTokens = useAdjustEventTokensStore((state) => state.eventTokens);
    const eventToken = eventTokens.find(
      (item) => event.toLowerCase() === item.event.toLowerCase()
    )?.token;
    if (
      window.android.AdjustEvent &&
      eventToken !== undefined &&
      eventToken !== ''
    ) {
      window.android.AdjustEvent(eventToken, event, name);
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

  setupNativePassiveInteractions(): void {
    window.android.logEvent = (event: string, params?: string) => {
      const entry = {
        event: event,
        params: params || '',
      };
      const payload = {
        caller: 'apk',
        client: 'web',
        version: this.getAppVersionName(),
        level: 'info',
        entry: entry,
        traceId: '',
        spanId: '',
        stackTrace: null,
      };
      this.loggerClientSendEvent(payload);
    };

    window.android.appAdjustAttribution = async (
      isFirst?: string,
      json?: string
    ) => {
      const firstAdjustAttributionReport =
        this.getStorage(AppLocalStorageKey.FIRST_ADJUST_ATTRIBUTION_REPORT) ||
        '';
      const jsonObj = JSON.parse(json || '{}');
      const clickLabel = jsonObj.clickLabel
        .split('__')
        .reduce((acc: any, pair: any) => {
          const [key, value] = pair.split('_');
          acc[key] = value;
          return acc;
        }, {});

      // 拿出 promoteGameId
      const promoteGameId = Number(clickLabel['promoteGameId'] || '-1');
      const referralCode = clickLabel['referralCode'] || '';
      console.log(
        '@@@===> AdjustAttribution.clickLabel',
        JSON.stringify(clickLabel, null, 2)
      );
      if (referralCode !== '') {
        useAppStore.getState().setTemporaryReferralCode(referralCode);
        this.setStorage(AppLocalStorageKey.REFERRAL_CODE, referralCode);
      }
      if (promoteGameId > 0) {
        this.setStorage(AppLocalStorageKey.PROMOTE_GAME_ID, `${promoteGameId}`);
        usePlatformDynamicConfigStore
          .getState()
          .setPromoteGameIds([promoteGameId]);
      }

      // 重新組裝
      const jsonStr = JSON.stringify({ ...jsonObj, clickLabel: clickLabel });

      if (isEmpty(firstAdjustAttributionReport)) {
        this.sendAnalyticsEvent<SensorsEventPayload>({
          event: 'JsBridge.android.appAdjustAttribution',
          sensorsType: SensorsPayloadType.ONCE_PROFILE,
          label: SensorsEventLabel.FIRST,
          profile: jsonStr || '{}',
        });
        this.setStorage(
          AppLocalStorageKey.FIRST_ADJUST_ATTRIBUTION_REPORT,
          `${dayjs().unix()}`
        );
        // 給 Android apk 上報使用
        this.setStorage(
          AppLocalStorageKey.SENSORS_DATA_LABEL_FIRST_REPORT,
          jsonStr
        );
        await sensorsDataReportStore.setItem<string>(
          SensorsEventLabel.FIRST,
          jsonStr
        );
      }

      if (json?.includes('medium_paid')) {
        this.sendAnalyticsEvent<SensorsEventPayload>({
          event: 'JsBridge.android.appAdjustAttribution',
          sensorsType: SensorsPayloadType.PROFILE,
          label: SensorsEventLabel.CURRENT,
          profile: jsonStr || '{}',
        });
        await sensorsDataReportStore.setItem<string>(
          SensorsEventLabel.CURRENT,
          jsonStr
        );
      }

      this.sendAnalyticsEvent<SensorsEventPayload>({
        event: 'JsBridge.android.appAdjustAttribution',
        sensorsType: SensorsPayloadType.PROFILE,
        label: SensorsEventLabel.LAST,
        profile: jsonStr || '{}',
      });
      await sensorsDataReportStore.setItem<string>(
        SensorsEventLabel.LAST,
        jsonStr
      );
    };

    window.android.appInstallApps = (json?: string) => {
      const today = dayjs().startOf('day').unix();
      const lastAppListReportDate = this.getStorage(
        AppLocalStorageKey.LAST_APP_LIST_REPORT_DATE
      );
      if (lastAppListReportDate === `${today}`) {
        return;
      }

      // Evan 批量上報處理
      const batchSize = 15;
      const jsonArr = JSON.parse(json || '[]');
      for (let i = 0; i < jsonArr.length; i += batchSize) {
        const batch = jsonArr.slice(i, i + batchSize);
        this.sendAnalyticsEvent<SensorsEventPayload>({
          event: 'JsBridge.android.appInstallApps',
          sensorsType: SensorsPayloadType.TRACK_APP_LIST,
          label: SensorsEventLabel.APP_LIST,
          profile: JSON.stringify(batch),
        });
      }
      this.setStorage(AppLocalStorageKey.LAST_APP_LIST_REPORT_DATE, `${today}`);
    };

    window.android.appAdjustDeeplinkResponse = (json?: string) => {
      // this.sendAnalyticsEvent<SensorsEventPayload>({
      //   event: 'JsBridge.android.appAdjustDeeplinkResponse',
      //   sensorsType: SensorsPayloadType.PROFILE,
      //   label: SensorsEventLabel.CURRENT,
      //   profile: json || '{}',
      // });
    };
  },

  setupNativeDeepLink(
    callback: (path: string, queryString: string) => void
  ): void {
    window.android.appDeepLink = async (path: string, queryString?: string) => {
      const queryParams = new URLSearchParams(queryString || '');
      const queryObj: { [key: string]: string } = {
        ['medium']: '',
        ['campaign']: '',
        ['adgroup']: '',
        ['creative']: '',
        ['channel']: '',
        ['source']: '',
        ['adjust_reftag']: '',
      };
      queryParams.forEach((value, key) => {
        queryObj[key] = value || queryObj[key];
      });

      const medium = queryObj['medium'] || '';
      const jsonStr = JSON.stringify({
        campaign: queryObj['campaign'] || '',
        adgroup: queryObj['adgroup'] || '',
        creative: queryObj['creative'] || '',
        clickLabel: {
          channel: queryObj['channel'] || '',
          source: queryObj['source'] || '',
          medium: medium,
        },
        adjust_reftag: queryObj['adjust_reftag'] || '',
      });

      if (medium.includes('paid')) {
        this.sendAnalyticsEvent<SensorsEventPayload>({
          event: 'JsBridge.android.appDeepLink',
          sensorsType: SensorsPayloadType.PROFILE,
          label: SensorsEventLabel.CURRENT,
          profile: jsonStr,
        });
        await sensorsDataReportStore.setItem<string>(
          SensorsEventLabel.CURRENT,
          jsonStr
        );
      }
      this.sendAnalyticsEvent<SensorsEventPayload>({
        event: 'JsBridge.android.appDeepLink',
        sensorsType: SensorsPayloadType.PROFILE,
        label: SensorsEventLabel.LAST,
        profile: jsonStr,
      });
      await sensorsDataReportStore.setItem<string>(
        SensorsEventLabel.LAST,
        jsonStr
      );
      callback(path, queryString || '');
    };
  },

  setupNativePushToken(callback: (oneSignalId: string) => void): void {
    // android 被動呼叫，沒使用也需要開啟該接口，避免報錯
    window.android.oneSignalSubscriptionId = (subscriptionId?: string) => {
      // TODO 有登入在綁定 OneSignalId 給 後端
      // console.log('@@@==> android subscriptionId', subscriptionId);
      // callback(subscriptionId || '');
    };

    window.android.appOneSignalId = (oneSignalId?: string) => {
      // TODO 有登入在綁定 OneSignalId 給 後端
      console.log('@@@==> android oneSignalId', oneSignalId);
      callback(oneSignalId || '');
    };
  },

  tryOpenAppFromSchema(schema: string, fallbackUrl: string): void {
    if (window.android.openAppOrBrowser) {
      window.android.openAppOrBrowser(schema, fallbackUrl);
    }
  },

  reloadWindow(): void {
    if (window.android.restartApp) {
      const { lastModified, eTag } = useAppStore.getState().realTimeH5Version;
      if (lastModified) {
        this.setStorage(AppLocalStorageKey.H5_LAST_MODIFIED, lastModified);
      }
      if (eTag) {
        this.setStorage(AppLocalStorageKey.H5_LAST_ETAG, eTag);
      }
      window.android.restartApp();
    }
  },

  updateBadgeCount(badgeCount: number): void {
    const count = badgeCount >= 0 ? badgeCount : 0;
    this.setStorage(AppLocalStorageKey.BADGER_COUNT, `${count}`);
    if (window.android.updateNotificationBadge) {
      window.android.updateNotificationBadge();
    }
  },

  addEventWithReminder(datetime: string, message: string): void {
    if (window.android.addEventWithReminder) {
      window.android.addEventWithReminder(datetime, message);
    }
  },

  getAppSetting(): AppSetting | null {
    if (window.android.getAppSetting) {
      try {
        const appSettingJson = window.android.getAppSetting();
        return JSON.parse(appSettingJson);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  getAppLaunchInfo(): AppLaunchInfo | null {
    if (window.android.getAppLaunchInfo) {
      try {
        const appLaunchInfoJSon = window.android.getAppLaunchInfo();
        return JSON.parse(appLaunchInfoJSon);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  isDeepLinkWakeUp(): boolean {
    if (window.android.isDeepLinkWakeUp) {
      return window.android.isDeepLinkWakeUp();
    } else {
      return false;
    }
  },

  getDeepLinkAppSetting(): AppSetting | null {
    if (window.android.getDeepLinkQueryString) {
      try {
        const deepLinkQueryString = window.android.getDeepLinkQueryString();
        return JSON.parse(deepLinkQueryString);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  // Storage
  getStorage(key: AppLocalStorageKey): string | null {
    if (window.android.getAppStorage) {
      return window.android.getAppStorage(key);
    } else {
      return null;
    }
  },

  setStorage(key: AppLocalStorageKey, value: string): void {
    if (window.android.setAppStorage) {
      window.android.setAppStorage(key, value);
    }
  },

  removeStorage(key: AppLocalStorageKey): void {
    if (window.android.setAppStorage) {
      window.android.setAppStorage(key, null);
    }
  },
};
