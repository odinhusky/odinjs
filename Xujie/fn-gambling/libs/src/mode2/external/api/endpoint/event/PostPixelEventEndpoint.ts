import { ExternalEndpoint } from '@mode2API/types';
import { POST_PIXEL_EVENT_URL } from '@mode2API/urls';
import isEmpty from 'lodash/isEmpty';
import sdkUtils from '@mode2/utils/sdk';
import { useFetchMyIpStore } from '@mode2/zustand/fetchMyIpStore';
import sortKeys from 'sort-keys';

export interface PixelEventPayload {
  accessToken: string;
  pixelId: string;
  fbc: string;
  fbp: string;

  // ip: string;
  // appId: string;
  // deviceID: string;
  // eventName: string;
}

export const PostPixelEventEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<boolean, PixelEventPayload>({
    query: (payload: PixelEventPayload) => {
      const data = sortKeys(
        {
          // vendorAccessToken: payload.accessToken,
          // vendorPixelID: payload.pixelId,
          fbc: payload.fbc || '',
          fbp: payload.fbp || '',
          appId: sdkUtils.getAppId(),
          deviceID: sdkUtils.getDeviceID(),
          // ip: useFetchMyIpStore.getState().ip,
          eventName: 'Launch',
        },
        { deep: true }
      );
      return {
        method: 'post',
        url: POST_PIXEL_EVENT_URL,
        data: data,
      };
    },
    transformResponse,
  });

const transformResponse = (response: string): boolean => {
  console.log('@@@===> postPixelEvent, response', response);
  const resp = response;
  return !isEmpty(resp);
};
