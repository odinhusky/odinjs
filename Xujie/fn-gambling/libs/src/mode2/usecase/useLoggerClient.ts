import sdkUtils from '@mode2/utils/sdk';

/**
 * API resp error 專用
 * @param url
 * @param status
 * @param data
 */
export const apiErrorLoggerEvent = async (
  url: string,
  status: number,
  data: unknown
) => {
  try {
    const entry = {
      event: 'api',
      params: `${url}, ${status}, ${data?.toString()}`,
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
 * API resp Exception 專用
 * @param error
 */
export const apiExceptionLoggerEvent = async (error: unknown) => {
  try {
    const entry = {
      event: 'apiException',
      params: `${error?.toString()}`,
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
      params: `${error?.toString()}, ${componentStack}`,
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
