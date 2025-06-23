import { AxiosInstance, AxiosResponse } from 'axios';
import dayjs from '@commonUtils/localizedDayjs';
import sdkUtils from '@mode2/utils/sdk';
import {
  SentryEventPayload,
  SentryPayloadType,
} from '@mode2/utils/sdk/strategy/analytics/SentryAnalytics';

interface ApiDurationProfile {
  message: string;
  extra: {
    traceId: string;
    duration: number;
  };
}

const sendEvent = (response: AxiosResponse | any) => {
  try {
    const url = response.config.url;
    const traceId = response.headers['x-trace-id'] || 'N/A';
    const startTime = response.config?.metadata?.startTime || 0;
    const endTime = dayjs().valueOf();
    const duration = endTime - startTime; // 耗时

    const profile: ApiDurationProfile = {
      message: url,
      extra: {
        traceId: traceId,
        duration: duration,
      },
    };

    sdkUtils.sendAnalyticsEvent<SentryEventPayload>({
      event: 'sentry.apiDuration',
      sentryType: SentryPayloadType.API_DURATION,
      severityLevel: 'info',
      profile: JSON.stringify(profile),
    });
  } catch (e) {}
};

/**
 * 額外的api 埋點
 * @param instance
 */
export const setupAxiosInstanceLoggerInterceptors = (
  instance: AxiosInstance
) => {
  instance.interceptors.request.use(
    async (config) => {
      const metadata = { startTime: dayjs().valueOf() }; // 添加开始时间戳
      config = { ...config, ...metadata };
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    async (response) => {
      sendEvent(response);
      return response;
    },
    (error) => {
      sendEvent(error);
      return Promise.reject(error);
    }
  );
};
