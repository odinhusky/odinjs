import {
  FirebaseApp,
  getApp,
  initializeApp,
  FirebaseOptions,
} from 'firebase/app';
import {
  getMessaging,
  getToken,
  MessagePayload,
  onMessage,
  Messaging,
  Unsubscribe,
} from 'firebase/messaging';
import axios from 'axios';
import { Push, PushExtra } from '@mode2/utils/sdk/interface/Push';
import * as console from 'node:console';

interface FirebaseExtra extends PushExtra {
  getCurrentToken(registrationSW?: ServiceWorkerRegistration): Promise<void>;

  getFirebaseApp(): Promise<FirebaseApp>;

  getFirebaseMessaging(): Promise<Messaging>;

  readFirebaseConfig(): Promise<FirebaseOptions>;
}

/**
 * local test 需要調整 vite.config.ts
 * @example
 * server: {
 *       open: true,
 *       port: 4200,
 *       host: localIP, // localIP 改成 localhost
 *       ...
 * }
 *
 * @example
 * plugins: [
 *       react(),
 *       basicSsl(), // 註解 basicSsl()
 *       nxViteTsPaths(),
 *       ...
 * ]
 */
export const FirebasePush: Push<
  MessagePayload,
  Unsubscribe | undefined,
  FirebaseExtra
> = {
  initPush() {
    this.requestPermission(() => {
      this.registerServiceWorker()?.then((registration) => {
        this.extra.getCurrentToken(registration);
      });
    });
  },
  /**
   * 請求通知權限
   * @param onGrant
   */
  requestPermission(onGrant: () => void) {
    Notification.requestPermission().then((permission) => {
      console.log('===> requestPermission', permission);
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        onGrant();
      }
    });
  },
  /**
   * [S3] firebase-messaging-sw.js
   * path = "./resources/firebase/in/v1/firebase-messaging-sw.js"
   */
  async registerServiceWorker() {
    const countryCode = import.meta.env['VITE_COUNTRY_CODE'];
    const vVersion = import.meta.env['VITE_V_VERSION'];
    const fnSetting = import.meta.env['VITE_FN_SETTING'];
    const firebaseMessagingSwPath = import.meta.env.DEV
      ? './firebase-messaging-sw.js'
      : `.${fnSetting}/firebase/${countryCode.toLowerCase()}/${vVersion}/firebase-messaging-sw.js`;
    let registrationSW = undefined;
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(firebaseMessagingSwPath)
        // .register('./firebase-messaging-sw.js')
        .then((registration) => {
          console.log(
            '===> Service Worker registered with scope:',
            registration.scope
          );
          registrationSW = registration;
        })
        .catch((error) => {
          console.error('===> Service Worker registration failed:', error);
        });
    }
    return Promise.resolve(registrationSW);
  },
  /**
   *
   * @param onPayload
   * [use case] 觀察 async Firebase.messaging.onMessage
   * @example
   *  // 註冊 firebase onMessage
   *   useEffect(() => {
   *     // 监听前台消息
   *     const subscribeToMessages = async () => {
   *       const unsubscribe = await FirebasePush.onPushMessage((payload) => {
   *         // TODO handle foreground payload
   *       });
   *       return unsubscribe;
   *     };
   *
   *     const setupSubscription = async () => {
   *       const unsubscribe = await subscribeToMessages();
   *       // 返回清理函数
   *       return () => {
   *         if (unsubscribe) {
   *           unsubscribe();
   *         }
   *       };
   *     };
   *     setupSubscription();
   *   }, []);
   */
  async onPushMessage(
    onPayload?: (onPayload: MessagePayload) => void
  ): Promise<Unsubscribe> {
    const messaging = await this.extra.getFirebaseMessaging();
    const unsubscribe = onMessage(messaging, (payload) => {
      if (onPayload) {
        onPayload(payload);
      }
    });
    return Promise.resolve(unsubscribe);
  },
  subscribePush(): void {},

  getPushToken(retryCount: number, delay: number): Promise<string> {
    return Promise.resolve('');
  },
  extra: {
    async getCurrentToken(registrationSW?: ServiceWorkerRegistration) {
      const vapidKey = import.meta.env['VITE_FIREBASE_API_KEY'];
      const messaging = await this.getFirebaseMessaging();
      getToken(messaging, {
        vapidKey: vapidKey,
        serviceWorkerRegistration: registrationSW,
      })
        .then((currentToken) => {
          if (currentToken) {
            // Send the token to your server and update the UI if necessary
            // ...
            console.log('===> currentToken', currentToken);

            Promise.resolve(currentToken);
          } else {
            // Show permission request UI
            console.log(
              '===> No registration token available. Request permission to generate one.'
            );
            // ...
          }
        })
        .catch((err) => {
          console.log('===> An error occurred while retrieving token. ', err);
          // ...
        });
    },
    async getFirebaseApp() {
      let app: FirebaseApp;
      try {
        app = getApp('[DEFAULT]');
      } catch (e) {
        const config = await this.readFirebaseConfig();
        app = initializeApp(config, '[DEFAULT]');
      }
      return app;
    },
    async getFirebaseMessaging() {
      const app = await this.getFirebaseApp();
      const messaging = getMessaging(app);
      return messaging;
    },
    /**
     * [S3] firebaseConfig.json
     * path = "resources/firebase/in/v1/firebaseConfig.json"
     */
    async readFirebaseConfig() {
      const countryCode = import.meta.env['VITE_COUNTRY_CODE'];
      const fnSetting = import.meta.env['VITE_FN_SETTING'];
      const vVersion = import.meta.env['VITE_V_VERSION'];
      const firebaseConfigPath = import.meta.env.DEV
        ? '/firebaseConfig.json'
        : `${fnSetting}/firebase/${countryCode.toLowerCase()}/${vVersion}/firebaseConfig.json`;
      const resp = await axios.get(firebaseConfigPath);
      const firebaseConfig = resp.data;
      console.log('===> firebaseConfig', firebaseConfig);
      return firebaseConfig;
    },
  },
};
