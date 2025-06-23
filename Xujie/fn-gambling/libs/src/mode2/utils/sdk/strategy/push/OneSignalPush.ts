import { MessagePayload, Unsubscribe } from 'firebase/messaging';
import { Push, PushExtra } from '@mode2/utils/sdk/interface/Push';
import OneSignal from 'react-onesignal';
import sdkUtils from '../..';
import { AppLocalStorageKey } from '../../persistant/storageKey';
import { useAppStore } from '@mode2/zustand/appStore';
import isEmpty from 'lodash/isEmpty';

interface OneSignalExtra extends PushExtra {
  isSupportOneSignalPush(): boolean;
}

/**
 * OneSignalPush
 * @author odin
 * @description 不需要其他設定，只需要 appId 跟 初始化即可
 */
export const OneSignalPush: Push<
  MessagePayload,
  Unsubscribe | undefined,
  OneSignalExtra
> = {
  initPush() {
    if (!this.extra.isSupportOneSignalPush()) {
      return;
    }
    const apiKey = import.meta.env['VITE_ONESIGNAL_API_KEY'] || '';
    if (typeof window !== 'undefined') {
      try {
        OneSignal.init({
          appId: apiKey,
          // appId: '66421e70-16f7-4800-aa81-50a9ccb0c6ab',
          // safari_web_id: 'web.onesignal.auto.5d56d362-2565-48e1-9c7d-b5c325eeeb04', // yaleen 本地
          // You can add other initialization options here
          notifyButton: {
            enable: true,
          },
          serviceWorkerParam: { scope: '/onesignal/' },
          serviceWorkerPath: 'onesignal/OneSignalSDKWorker.js',
          // Uncomment the below line to run on localhost. See: https://documentation.onesignal.com/docs/local-testing
          allowLocalhostAsSecureOrigin: true,
          requiresUserPrivacyConsent: false, // 允许您延迟 SDK 的初始化，直到用户提供隐私同意
          // welcomeNotification: {
          //   title: import.meta.env.VITE_PACKAGENAME,
          //   message: "Thanks for subscribing!",
          // },
        });
      } catch (e) {
        console.error('init OneSignal SDK error');
      }
      this.registerServiceWorker()
        ?.then(() => {
          this.subscribePush();
        })
        .catch(() => {});
    }
  },
  /**
   * 自定義訂閱 覆蓋預設訂閱時間
   * 兩種情況 1 瀏覽器未允許通知 2 瀏覽器允許通知但未訂閱
   */
  subscribePush() {
    if (!this.extra.isSupportOneSignalPush()) {
      return;
    }
    const isFirst = sdkUtils.getStorage(
      AppLocalStorageKey.ONESIGNAL_NOTIFICATION_PROMPT
    );
    console.log('@@==>OneSignal isFirst', isFirst);
    if (!isFirst) {
      OneSignal.Slidedown.promptPush();
      return;
    }

    // 是否有通知权限
    const permission = OneSignal.Notifications.permission;
    console.log('@@===>OneSignal isPermission', permission);
    if (permission) {
      const isSubscribe = OneSignal.User.PushSubscription.optedIn;
      console.log('@@===>OneSignal current subscribe status', isSubscribe);
      // OneSignal.Slidedown.promptPush();
      if (!isSubscribe) {
        // 靜默訂閱
        console.log('@@===>OneSignal Silent subscription');
        OneSignal.User.PushSubscription.optIn();
      }
    } else {
      // 請求推播通知權限，會直接訂閱推播
      OneSignal.Notifications.requestPermission();
      // OneSignal.Slidedown.promptPush();
    }

    // get OneSignal Id
    this.getPushToken(5, 500).then((resp) => {
      if (!isEmpty(resp)) {
        useAppStore.getState().setPushToken(resp);
      }
    });
  },
  /**
   * 請求通知權限: OneSignal 不需要 => 空實作
   * @param onGrant
   */
  requestPermission() {
    if (!this.extra.isSupportOneSignalPush()) {
      return;
    }
    Notification.requestPermission().then((permission) => {
      console.log('===> requestPermission', permission);
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        this.subscribePush();
      }
    });
  },

  /**
   * OneSignal 不需要 => 空實作
   */
  async registerServiceWorker() {
    if (!this.extra.isSupportOneSignalPush()) {
      return;
    }
    let registrationSW = undefined;
    if ('serviceWorker' in navigator) {
      try {
        // register Service Worker
        // ServiceWorkerRegistration
        const registration = await navigator.serviceWorker.register(
          '/onesignal/OneSignalSDKWorker.js',
          { scope: '/onesignal/' }
        );
        console.log(
          'Service Worker Registration successful, the range is:',
          registration.scope
        );

        const registrations = await navigator.serviceWorker.getRegistrations();
        console.log('@==> Service Worker Registrations', registrations);

        for (const reg of registrations) {
          if (reg.active?.scriptURL.includes('sw.js')) {
            await reg.unregister();
            console.log(
              'Unregister the old one Service Worker:',
              reg.active.scriptURL
            );
            registrationSW = reg;
          }
        }
      } catch (error) {
        console.log('Service Worker Registration failed:', error);
        return Promise.reject();
      }
    } else {
      console.log('Browser not supported Service Worker');
    }
    return Promise.resolve(registrationSW);
  },

  /**
   * OneSignal 不需要 => 空實作
   */
  onPushMessage() {
    return undefined;
  },

  getPushToken(retryCount: number = 15, delay: number = 500): Promise<string> {
    return new Promise((resolve) => {
      const attempt = (retriesLeft: number) => {
        // get(window.OneSignal?.User, 'onesignalId', null);
        // const onesignalId =window.OneSignal?.User?.onesignalId;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onesignalId = (window.OneSignal?.User as any)?.onesignalId;
        if (onesignalId) {
          resolve(onesignalId);
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
  extra: {
    isSupportOneSignalPush(): boolean {
      const apiKey = import.meta.env['VITE_ONESIGNAL_API_KEY'] || '';
      return !isEmpty(apiKey);
    },
  },
};
