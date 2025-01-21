import sdkUtils from '../utils/sdk';
import {
  SentryEventPayload,
  SentryPayloadType,
} from '@mode2/utils/sdk/strategy/analytics/SentryAnalytics';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';

export interface HandleGlobalClickParams {
  target?: string; // 標示是從哪裡調用的 可以給 IndexClick, EventClick....
  callback: <T>(arg?: T) => void; // 要執行的 callback
}

/**
 * @author odin
 * @description 為了埋點或統一管理做的 click function
 */
export const handleGlobalClick = ({
  target,
  callback,
}: HandleGlobalClickParams) => {
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

  if (target) console.log('@@ Mode2 handleGlobalClick target=>', target);

  if (callback instanceof Function) callback();
};

export default handleGlobalClick;
