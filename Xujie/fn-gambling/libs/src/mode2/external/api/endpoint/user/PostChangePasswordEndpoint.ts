import { ExternalEndpoint } from '@mode2API/types';
import { POST_CHANGE_PASSWORD_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { Md5 } from 'ts-md5';

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;

  // password: string; // 直接用 newPassword
  // repeatPassword: string; // 前端先驗證就好，也用 newPassword
}

interface ChangePasswordResponse {
  Token?: string;
}

export type ChangePasswordResult = {
  token: string;
};

export const PostChangePasswordEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<ChangePasswordResult, ChangePasswordRequest>({
    query: (data: ChangePasswordRequest) => {
      return {
        method: 'post',
        url: POST_CHANGE_PASSWORD_URL,
        data: {
          reqData: {
            oldPassword: Md5.hashStr(data.oldPassword),
            password: Md5.hashStr(data.newPassword),
            repeatPassword: Md5.hashStr(data.newPassword),
          },
        },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<ChangePasswordResponse> // api resp 結構
): ChangePasswordResult => {
  const resp = response.Body;
  return {
    token: resp?.Token || '',
  };
};
