import { useAppStore } from '@mode2/zustand/appStore';
import { useEffect } from 'react';
import sdkUtils from '@mode2/utils/sdk';
import {
  PostHogEventPayload,
  PostHogPayloadType,
} from '@mode2/utils/sdk/strategy/analytics/PostHogAnalytics';

export const useAnalyticsRegister = () => {
  const isAndroidFirstInteractionSuccess = useAppStore(
    (state) => state.isAndroidFirstInteractionSuccess
  );

  useEffect(() => {
    if (isAndroidFirstInteractionSuccess) {
      sdkUtils.sendAnalyticsEvent<PostHogEventPayload>({
        event: 'posthog.register',
        postHogType: PostHogPayloadType.REGISTER,
        parameter: '{}',
      });

      sdkUtils.sendAnalyticsEvent<PostHogEventPayload>({
        event: 'posthog.onceIdentify',
        postHogType: PostHogPayloadType.ONCE_IDENTIFY,
        parameter: '{}',
      });
    }
  }, [isAndroidFirstInteractionSuccess]);
};

export default useAnalyticsRegister;
