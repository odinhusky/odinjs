import {
  Analytics,
  AnalyticsExtra,
  IErrorPayload,
  IEventPayload,
} from '@mode2/utils/sdk/interface/Analytics';
import posthog from 'posthog-js';
import { useFetchMyIpStore } from '@mode2/zustand/fetchMyIpStore';
import sdkUtils from '@mode2/utils/sdk';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';

export interface PostHogFeature {
  flag: string;
  describe: string;
  probation: string; // 留校察看期間，到時關閉flag成為穩定功能
}

export const PostHogFeatureTypes = {
  lottiePreview: {
    flag: 'lottie_preview',
    describe: 'TW環境才可以預覽 lottie preview page',
    probation: 'everlasting',
  },
  // repeatTopUpBonus: {
  //   flag: 'repeat_topup_bonus',
  //   describe: '角色[User]，復充優惠加碼功能',
  //   probation: '2025/05/27 ~ 2025/06/10',
  // },
  secretRecharge: {
    flag: 'secret_recharge',
    describe: '(站內信/推播) 充值優惠',
    probation: '2025/05/29 ~ 2025/06/12',
  },
  lowBalanceRescueBox: {
    flag: 'low_balance_rescue_box',
    describe: '破產寶箱， 彈窗/頁面/Deeplink',
    probation: 'undefined',
  },
} satisfies Record<string, PostHogFeature>;

export enum PostHogPayloadType {
  EVENT = 'EVENT',
  USER = 'USER',
  LOGOUT = 'LOGOUT',
  ONCE_IDENTIFY = 'ONCE_IDENTIFY',
  REGISTER = 'REGISTER',
  PAGE_VIEW = 'PAGE_VIEW',
  ALIAS = 'ALIAS',
  NOTIFY_DEEP_LINK = 'NOTIFY_DEEP_LINK',
  WEB_DEEP_LINK = 'WEB_DEEP_LINK',
  APP_INSTALL = 'APP_INSTALL',
}

export interface PostHogUserProfile {
  env: string;
  id: number;
  username?: string;
  player_name?: string;
  ip_address: string;
  device_id: string;
  current_token: string;
  channel_id: string;
  app_device_id: string;
  h5_version: string;
  web2app_posthog_distinctId: string;
  apk_build_id: string; // def=''
  apk_build_time: number; // def=0
}

export interface PostHogEvent {
  url: string;
  event: string;
  action: string;
  playerId: string;
  playerToken: string;
  userRole: string;
  deviceId: string;
  os: string;
  version: string;
  duration: number;
  timestamp?: unknown;
}

export interface PostHogEventPayload extends IEventPayload {
  postHogType: PostHogPayloadType;
  parameter: string;
}

export interface PostHogErrorPayload extends IErrorPayload {
  error: string;
}

interface PostHogAnalyticsExtra extends AnalyticsExtra {
  isSupportPostHogAnalytics: () => boolean;
  getApiHost: () => string;
  getApiKey: () => string;
  getPostHogDistinctId: () => string | undefined;
  getDistinctId: () => string;
}

const ENV_NAME: string = import.meta.env.DEV
  ? 'dev'
  : import.meta.env['VITE_PACKAGENAME'];

export const PostHogAnalytics: Analytics<
  PostHogEventPayload,
  PostHogErrorPayload,
  PostHogAnalyticsExtra
> = {
  init(): void {
    if (this.extra.isSupportPostHogAnalytics()) {
      posthog?.init(this.extra.getApiKey(), {
        api_host: this.extra.getApiHost(),
        feature_flag_request_timeout_ms: 3000, // Time in milliseconds. Default is 3000 (3 seconds).
        autocapture: true,
        capture_pageview: false,
        disable_session_recording: false,
        // debug: false,
        // loaded: (ph) => {
        //   const distinctId = this.extra.getPostHogDistinctId();
        //   console.log('@@@===> PostHog init loaded distinctId', distinctId);
        //   if (distinctId) {
        //     console.log('@@@===> PostHog init loaded identify', distinctId);
        //     ph.identify(distinctId);
        //   }
        // },
      });

      // posthog.register({
      //   env: ENV_NAME,
      //   channel_id: sdkUtils.getAppId(),
      //   device_id: sdkUtils.getDeviceID(),
      // });

      // if (sdkUtils.getStorage(AppLocalStorageKey.TOKEN) === null) {
      //   this.sendEvent({
      //     event: 'posthog.logout',
      //     postHogType: PostHogPayloadType.LOGOUT,
      //     parameter: '',
      //   });
      // }
    }
  },

  sendEvent(payload: PostHogEventPayload): void {
    if (this.extra.isSupportPostHogAnalytics()) {
      switch (payload.postHogType) {
        case PostHogPayloadType.PAGE_VIEW:
          {
            const pageViewInfo: { currentUrl?: string } = JSON.parse(
              payload.parameter || '{}'
            );
            console.log('@@@===> PostHog pageView', payload.parameter);
            const currentUrl = pageViewInfo.currentUrl;
            if (currentUrl) {
              posthog?.capture('$pageview', {
                $current_url: currentUrl,
              });
            }
          }
          break;
        case PostHogPayloadType.REGISTER:
          {
            try {
              const properties = {
                env: ENV_NAME,
                channel_id: sdkUtils.getAppId(),
                device_id: sdkUtils.getDeviceID(),
              };
              console.log(
                '@@@===> PostHog register properties',
                JSON.stringify(properties)
              );
              posthog?.register({ ...properties });
            } catch (e) {
              console.error('@@@===> PostHog register properties error', e);
            }
          }
          break;
        case PostHogPayloadType.ONCE_IDENTIFY:
          {
            try {
              const distinctId = this.extra.getPostHogDistinctId();
              console.log('@@@===> PostHog init loaded distinctId', distinctId);
              if (distinctId) {
                console.log('@@@===> PostHog init loaded identify', distinctId);
                posthog?.identify(distinctId);
              }
            } catch (e) {
              console.error('@@@===> PostHog init loaded identify error', e);
            }
          }
          break;
        case PostHogPayloadType.LOGOUT:
          try {
            console.log('@@@===> PostHog reset');
            posthog?.reset();
          } catch (e) {
            console.error('@@@===> PostHog reset error', e);
          }
          break;
        case PostHogPayloadType.ALIAS:
          {
            try {
              const alias: { newId?: string; existingId?: string } = JSON.parse(
                payload.parameter || '{}'
              );
              console.log('@@@===> PostHog alias', JSON.stringify(alias));
              if (alias.newId && alias.existingId) {
                posthog?.alias(alias.newId, alias.existingId);
              }
            } catch (e) {
              console.error('@@@===> PostHog alias error', e);
            }
          }
          break;
        case PostHogPayloadType.USER:
          {
            this.sendEvent({
              event: 'posthog.register',
              postHogType: PostHogPayloadType.REGISTER,
              parameter: '{}',
            });

            this.sendEvent({
              event: 'posthog.onceIdentify',
              postHogType: PostHogPayloadType.ONCE_IDENTIFY,
              parameter: '{}',
            });

            const playerId = useUserProfileStore.getState().id;
            const postHogDistinctId =
              sdkUtils.getAppSetting()?.postHogDistinctId;
            const buildId = sdkUtils.getAppLaunchInfo()?.buildId;
            const buildTime = sdkUtils.getAppLaunchInfo()?.buildTime;
            try {
              const playerName = useUserProfileStore.getState().playerName;
              if (playerId > 0) {
                const token =
                  sdkUtils.getStorage(AppLocalStorageKey.TOKEN) || '';
                const userInfo: PostHogUserProfile = {
                  env: ENV_NAME,
                  id: playerId,
                  username: playerId !== 0 ? `${playerId}` : undefined,
                  player_name: playerName ? playerName : undefined,
                  ip_address: useFetchMyIpStore.getState().ip,
                  device_id: sdkUtils.getDeviceID(),
                  current_token: token,
                  channel_id: sdkUtils.getAppId(), // 會變
                  app_device_id: sdkUtils.getWebDeviceId(),
                  h5_version: sdkUtils.getH5VersionName(),
                  web2app_posthog_distinctId: postHogDistinctId || '',
                  apk_build_id: buildId || '',
                  apk_build_time: buildTime || 0,
                };

                console.log(
                  '@@@===> PostHog identify',
                  `${ENV_NAME}_${playerId}`,
                  JSON.stringify(userInfo)
                );

                posthog?.identify(`${ENV_NAME}_${playerId}`, {
                  ...userInfo,
                });
              }
            } catch (e) {
              // console.error("PostHogAnalytics.sendEvent", JSON.stringify(payload) , e)
            }

            this.sendEvent({
              event: 'posthog.alias',
              postHogType: PostHogPayloadType.ALIAS,
              parameter: JSON.stringify({
                newId: `${ENV_NAME}_${playerId}`,
                existingId: postHogDistinctId,
              }),
            });
          }
          break;
        case PostHogPayloadType.EVENT:
          {
            try {
              posthog?.capture(`Event.${payload.event}`, {
                payload: { ...JSON.parse(payload.parameter) },
              });
            } catch (e) {}
          }
          break;
        case PostHogPayloadType.APP_INSTALL:
          {
            try {
              // AppInstall
              // os ['android'] ['ios']
              const firstInstallTime =
                sdkUtils.getAppLaunchInfo()?.firstInstallTime;
              const buildTime = sdkUtils.getAppLaunchInfo()?.buildTime;
              console.log(
                '@@@===> PostHog Event.APP_INSTALL firstInstallTime:',
                firstInstallTime
              );
              if (firstInstallTime && firstInstallTime > 0) {
                posthog?.capture(
                  'AppInstall',
                  {
                    os: sdkUtils.getOs(),
                    apk_build_time: buildTime || 0,
                  },
                  {
                    timestamp: new Date(firstInstallTime),
                  }
                );
              }
            } catch (e) {
              console.log('@@@===> PostHog Event.APP_INSTALL error', e);
            }
          }
          break;
        case PostHogPayloadType.NOTIFY_DEEP_LINK:
          {
            try {
              // 推播 喚醒
              // deepLinkPath ['/hall'] replace ['hall']
              // deepLinkQueryString : '?notify_id={UUID}'
              const deepLinkInfo: {
                deepLinkPath?: string;
                deepLinkQueryString?: string;
              } = JSON.parse(payload.parameter || '{}');
              const query = deepLinkInfo?.deepLinkQueryString || '';
              const normalized = query.startsWith('?') ? query : `?${query}`;
              const options = Object.fromEntries(
                new URLSearchParams(normalized).entries()
              );
              console.log(
                '@@@===> PostHog Event.NOTIFY_DEEP_LINK options:',
                JSON.stringify(options)
              );
              posthog?.capture('NotifyDeepLink', {
                deepLinkPath: deepLinkInfo?.deepLinkPath || '',
                ...options,
              });
            } catch (e) {
              console.error('@@@===> PostHog Event.NOTIFY_DEEP_LINK error', e);
            }
          }
          break;
        case PostHogPayloadType.WEB_DEEP_LINK:
          {
            try {
              //  網頁 喚醒
              // from ['web2app']
              console.log('@@@===> PostHog Event.WEB_DEEP_LINK');
              posthog?.capture('WebDeepLink', { from: 'web2app' });
            } catch (e) {
              console.error('@@@===> PostHog Event.WEB_DEEP_LINK error', e);
            }
          }
          break;
      }
    }
  },

  sendError(payload: PostHogErrorPayload): void {
    if (this.extra.isSupportPostHogAnalytics()) {
    }
  },

  extra: {
    getApiHost(): string {
      return import.meta.env['VITE_POST_HOG_PUBLIC_POSTHOG_HOST'];
    },
    getApiKey(): string {
      return import.meta.env['VITE_POST_HOG_PUBLIC_POSTHOG_KEY'];
    },
    isSupportPostHogAnalytics(): boolean {
      return !!import.meta.env['VITE_POST_HOG_PUBLIC_POSTHOG_KEY'];
    },
    getPostHogDistinctId() {
      console.log(
        '@@@===> PostHog getPostHogDistinctId getAppSetting',
        JSON.stringify(sdkUtils.getAppSetting() || '{}')
      );
      const getDistinctFlag = sdkUtils.getStorage(
        AppLocalStorageKey.FETCH_ONCE_DISTINCT_ID_FLAG
      );
      const postHogDistinctId = sdkUtils.getAppSetting()?.postHogDistinctId;
      console.log(
        '@@@===> PostHog getAppSetting.postHogDistinctId',
        postHogDistinctId
      );
      if (postHogDistinctId && getDistinctFlag !== postHogDistinctId) {
        sdkUtils.setStorage(
          AppLocalStorageKey.FETCH_ONCE_DISTINCT_ID_FLAG,
          postHogDistinctId
        );
        return postHogDistinctId;
      } else {
        return undefined;
      }
    },
    getDistinctId() {
      // posthog?.reset();
      const id = posthog?.get_distinct_id() || '';
      console.log('@@@===> PostHog getDistinctId', id);
      return id;
    },
  },
};
