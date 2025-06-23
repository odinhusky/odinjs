import sdkUtils from '@mode2/utils/sdk';
import dayjs from '@commonUtils/localizedDayjs';

/**
 * API resp error 專用
 * @param url
 * @param status
 * @param data
 */
export const apiErrorLoggerEvent = async (
  url: string,
  status: number,
  data: unknown,
  traceId: string = ''
) => {
  try {
    const entry = {
      event: 'api',
      params: {
        url: url,
        status: status,
        time: dayjs().unix(),
        resp: data,
      },
      // params: `${url}, ${status}, ${dayjs().unix()}, ${JSON.stringify(
      //   data || '{}'
      // )}`,
    };
    const payload = {
      caller: 'web',
      client: 'web',
      version: sdkUtils.getAppVersionName(),
      level: 'error',
      entry: entry,
      traceId: traceId,
      spanId: '',
      stackTrace: null,
    };
    sdkUtils.loggerClientSendEvent(payload);
  } catch (e) {
    console.error(e);
  }
};

/**
 * API resp Exception 專用
 * @param error
 */
export const apiExceptionLoggerEvent = async (error: unknown) => {
  try {
    const entry = {
      event: 'apiException',
      params: JSON.stringify({
        time: dayjs().unix(),
        error: error,
      }),
      // params: ` ${dayjs().unix()}, ${JSON.stringify(error || '{}')}`,
    };
    const payload = {
      caller: 'web',
      client: 'web',
      version: sdkUtils.getAppVersionName(),
      level: 'error',
      entry: entry,
      traceId: '',
      spanId: '',
      stackTrace: null,
    };
    sdkUtils.loggerClientSendEvent(payload);
  } catch (e) {
    console.error(e);
  }
};

/**
 * 全局邊界監聽錯誤
 * @param error
 * @param componentStack
 */
export const errorHandlerLoggerEvent = async (
  error: unknown,
  componentStack: string
) => {
  try {
    const entry = {
      event: 'errorHandler',
      params: JSON.stringify({
        componentStack: componentStack,
        time: dayjs().unix(),
        error: error,
      }),
      // params: ` ${dayjs().unix()}, ${JSON.stringify(
      //   error || '{}'
      // )}, ${componentStack}`,
    };
    const payload = {
      caller: 'web',
      client: 'web',
      version: sdkUtils.getAppVersionName(),
      level: 'error',
      entry: entry,
      traceId: '',
      spanId: '',
      stackTrace: null,
    };
    sdkUtils.loggerClientSendEvent(payload);
  } catch (e) {
    console.error(e);
  }
};
