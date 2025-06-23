import sdkUtils from '../utils/sdk';
import {
  SentryEventPayload,
  SentryPayloadType,
} from '@mode2/utils/sdk/strategy/analytics/SentryAnalytics';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import { ReportEvent } from '../utils/sdk/strategy/analytics/local/types';
import { useUserProfileStore } from '../zustand/user/userProfileStore';
import dayjs from '@commonUtils/localizedDayjs';
import {
  PostHogEventPayload,
  PostHogPayloadType,
} from '@mode2/utils/sdk/strategy/analytics/PostHogAnalytics';

export interface HandleGlobalClickParams {
  target?: string; // 標示是從哪裡調用的 可以給 IndexClick, EventClick....
  payload?: unknown;
  callback: <T>(arg?: T) => void; // 要執行的 callback
  debounceTimer?: number;
}

/**
 * 防抖函数
 * @param func 要执行的函数
 * @param delay 延迟时间（毫秒）
 */
const debounced = <T extends HandleGlobalClickParams>(
  func: (params: T) => void
) => {
  const timerMap = new Map<string, NodeJS.Timeout>();

  return (params: T) => {
    const { debounceTimer = 0, target = 'default' } = params;
    const key = String(target);

    const existingTimer = timerMap.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      func(params);
      timerMap.delete(key);
    }, debounceTimer);

    timerMap.set(key, timer);
  };
};

/**
 * @author odin
 * @description 為了埋點或統一管理做的 click function
 */
export const handleGlobalClick = debounced(
  ({ target, payload, callback }: HandleGlobalClickParams) => {
    sdkUtils.playSound();

    const profile = {
      message: target,
      extra: {
        device_id: sdkUtils.getDeviceID(),
        current_token: sdkUtils.getStorage(AppLocalStorageKey.TOKEN) || '',
      },
    };

    sdkUtils.sendAnalyticsEvent<SentryEventPayload>({
      event: 'sentry.click',
      sentryType: SentryPayloadType.CLICK_EVENT,
      severityLevel: 'info',
      profile: JSON.stringify(profile),
    });

    const reportEvent = {
      url: window.location.href,
      event: ReportEvent.CLICK,
      action: target || 'handleGlobalClick',
      playerId: `${useUserProfileStore.getState().id}`,
      playerToken: sdkUtils.getStorage(AppLocalStorageKey.TOKEN) || '',
      userRole: useUserProfileStore.getState().userRole,
      deviceId: sdkUtils.getDeviceID(),
      os: sdkUtils.getOs(),
      version: import.meta.env['VITE_VERSION'],
      duration: 0,
      timestamp: dayjs().unix(),
      additional: payload ? payload : null,
    };

    sdkUtils.addReportEvent(reportEvent);

    if (target) {
      sdkUtils.sendAnalyticsEvent<PostHogEventPayload>({
        event: target,
        postHogType: PostHogPayloadType.EVENT,
        parameter: payload ? JSON.stringify(payload) : '{}',
      });
    }

    if (target)
      console.log('@@ Mode2 handleGlobalClick target=>', target, payload);

    if (callback instanceof Function) callback();
  }
);

export default handleGlobalClick;
