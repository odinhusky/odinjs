import { ExternalEndpoint } from '@mode2API/types';
import { POST_BIND_NOTIFY_TOKEN_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export interface BindPushTokenRequest {
  token: string;
}

export const PostBindPushTokenEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<boolean, BindPushTokenRequest>({
    query: (data: BindPushTokenRequest) => {
      return {
        method: 'post',
        url: POST_BIND_NOTIFY_TOKEN_URL,
        data: {
          reqData: data,
        },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<string> // api resp 結構
): boolean => {
  return response.Code === 200;
};
