import { ExternalEndpoint } from '@mode2API/types';
import { POST_DEVICE_EVENT_URL } from '@mode2API/urls';
import isEmpty from 'lodash/isEmpty';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export enum AppDeviceEvent {
  BUILD = 0, // 打包
  INSTALL = 1, // 安装
  LAST_UPDATE = 4, // 更新
  LAUNCH = 2, // 啟動
  LOGIN = 3, // 登入
}

export interface DeviceEventPayload {
  buildId: string;
  event: AppDeviceEvent;
  eventTime: number;
  params: string;
}

export interface DeviceEventResult {
  event: AppDeviceEvent;
  eventTime: number;
}

export const PostDeviceEventEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<DeviceEventResult | undefined, DeviceEventPayload>({
    query: (payload) => {
      return {
        method: 'post',
        url: POST_DEVICE_EVENT_URL,
        data: { ...payload },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<null>,
  meta: unknown,
  arg: DeviceEventPayload
): DeviceEventResult | undefined => {
  if (response?.Code === 200) {
    return {
      event: arg.event,
      eventTime: arg.eventTime,
    };
  } else {
    return undefined;
  }
  return;
};
