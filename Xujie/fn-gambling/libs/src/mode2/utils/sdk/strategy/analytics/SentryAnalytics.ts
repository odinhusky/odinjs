import {
  Analytics,
  AnalyticsExtra,
  IErrorPayload,
  IEventPayload,
} from '../../interface/Analytics';
// import * as Sentry from '@sentry/react';
// import { SeverityLevel } from '@sentry/react';
import isEmpty from 'lodash/isEmpty';
import { useFetchMyIpStore } from '@mode2/zustand/fetchMyIpStore';
import sdkUtils from '@mode2/utils/sdk';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';

export enum SentryPayloadType {
  EVENT = 'EVENT',
  CLICK_EVENT = 'CLICK_EVENT',
  USER = 'USER',
  PAGE_DURATION = 'PAGE_DURATION',
  API_DURATION = 'API_DURATION',
}

export interface SentryUserProfile {
  id: string;
  username: string;
  ip_address: string;
  device_id: string;
  current_token: string;
}

export interface SentryEventPayload extends IEventPayload {
  sentryType: SentryPayloadType;
  // severityLevel: SeverityLevel;
  severityLevel: string;
  profile: string;
}

export interface SentryErrorPayload extends IErrorPayload {
  exception: string;
}

interface SentryAnalyticsExtra extends AnalyticsExtra {
  /**
   * development 不給 dns 就可以
   */
  isSupportSentryAnalytics(): boolean;

  /**
   * 初始使用者定位資訊
   * @constructor
   */
  initialUserTargetingInfo(
    analytics: Analytics<
      SentryEventPayload,
      SentryErrorPayload,
      SentryAnalyticsExtra
    >
  ): void;
}

export const SentryAnalytics: Analytics<
  SentryEventPayload,
  SentryErrorPayload,
  SentryAnalyticsExtra
> = {
  // init(): void {
  //   if (this.extra.isSupportSentryAnalytics()) {
  //     console.log('@@@===> Sentry init ');
  //     Sentry.init({
  //       dsn: import.meta.env['VITE_SENTRY_DNS'],
  //       environment: `${import.meta.env['VITE_COUNTRY_CODE'].toLowerCase()}_${
  //         import.meta.env['VITE_PACKAGENAME']
  //       }`,
  //       release: `${import.meta.env['VITE_VERSION']}`,
  //       integrations: [
  //         Sentry.browserTracingIntegration(),
  //         Sentry.replayIntegration({
  //           blockAllMedia: false,
  //           maskAllInputs: false,
  //           maskAllText: false,
  //         }),
  //         Sentry.reactRouterV6BrowserTracingIntegration({
  //           useEffect: React.useEffect,
  //           useLocation,
  //           useNavigationType,
  //           createRoutesFromChildren,
  //           matchRoutes,
  //         }),
  //       ],
  //       // Tracing
  //       tracesSampleRate: 1.0, //  Capture 100% of the transactions
  //       // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  //       tracePropagationTargets: [
  //         'localhost',
  //         /^https:\/\/yourserver\.io\/api/,
  //       ],
  //       // Session Replay
  //       replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  //       replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  //     });
  //
  //     初始定位資訊
  //     this.extra.initialUserTargetingInfo(this);
  //   }
  // },
  // sendEvent(payload: SentryEventPayload): void {
  //   if (this.extra.isSupportSentryAnalytics()) {
  //     switch (payload.sentryType) {
  //       case SentryPayloadType.CLICK_EVENT:
  //         {
  //           const jsonOgj = JSON.parse(payload.profile);
  //           Sentry.captureEvent({
  //             ...jsonOgj,
  //             level: payload.severityLevel,
  //           });
  //         }
  //         break;
  //       case SentryPayloadType.EVENT:
  //         Sentry.captureMessage(payload.profile, payload.severityLevel);
  //         break;
  //       case SentryPayloadType.USER: {
  //         const userData: SentryUserProfile | null =
  //           JSON.parse(payload.profile) || null;
  //         if (userData) {
  //           Sentry.setUser(userData);
  //         }
  //         break;
  //       }
  //       case SentryPayloadType.PAGE_DURATION: {
  //         // 停留时间
  //         const jsonOgj = JSON.parse(payload.profile);
  //         Sentry.captureEvent({
  //           ...jsonOgj,
  //           level: payload.severityLevel,
  //         });
  //         break;
  //       }
  //       case SentryPayloadType.API_DURATION: {
  //         // 停留时间
  //         const jsonOgj = JSON.parse(payload.profile);
  //         Sentry.captureEvent({
  //           ...jsonOgj,
  //           level: payload.severityLevel,
  //         });
  //         break;
  //       }
  //     }
  //   }
  // },
  // sendError(payload: SentryErrorPayload): void {
  //   if (this.extra.isSupportSentryAnalytics()) {
  //     Sentry.captureException(payload.exception);
  //   }
  // },

  init(): void {},
  sendEvent(payload: SentryEventPayload): void {},
  sendError(payload: SentryErrorPayload): void {},
  extra: {
    isSupportSentryAnalytics(): boolean {
      const dns: string = import.meta.env['VITE_SENTRY_DNS'] || '';
      return !isEmpty(dns);
    },
    initialUserTargetingInfo(
      analytics: Analytics<
        SentryEventPayload,
        SentryErrorPayload,
        SentryAnalyticsExtra
      >
    ): void {
      const userInfo: SentryUserProfile = {
        id: '',
        username: 'guest',
        ip_address: useFetchMyIpStore.getState().ip,
        device_id: sdkUtils.getDeviceID(),
        current_token: sdkUtils.getStorage(AppLocalStorageKey.TOKEN) || '',
      };
      analytics.sendEvent({
        event: 'sentry.guest',
        sentryType: SentryPayloadType.USER,
        severityLevel: 'info',
        profile: JSON.stringify(userInfo),
      });
    },
  },
};
