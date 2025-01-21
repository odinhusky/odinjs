import { Md5 } from 'ts-md5';
import { POST_PLAYER_INFORMATION_SAVE_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import sortKeys from 'sort-keys';

// 前端傳入的參數接口
export interface UIPlayerInfoSaveRequest {
  bankCode?: string;
  ifsc?: string;
  phone: string;
  realName?: string;
  userName: string;
  password?: string;
  repeatPassword?: string;
  isBindAll: boolean; // 是否同時綁定個人和銀行資訊
}

// API 發送的請求接口
export interface ApiPlayerInfoSaveRequest {
  bankCode: string;
  email: string;
  ifsc: string;
  lazyPassword?: string; // MD5 string
  mobile: string;
  name: string;
  nickname: string;
  password: string; // MD5 string
  payType: string; // 常量，如 'BANK_TRANSFER'
  repeatPassword: string; //  MD5 string
  withoutPayment?: boolean;
}

type PlayerInfoSaveResponse = {
  PayChannel?: string;
  PayMode?: string;
  Data?: string;
};

/**
 * 同時綁定個人資訊＆銀行資訊
 * 或者只綁定個人資訊
 */
export const PostPlayerInfoSaveEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PlayerInfoSaveResult, UIPlayerInfoSaveRequest>({
    query: (data: UIPlayerInfoSaveRequest) => {
      const reqData: ApiPlayerInfoSaveRequest = sortKeys({
        bankCode: data?.bankCode || '',
        email: '',
        ifsc: data.ifsc || '',
        mobile: data.phone,
        name: data.realName || '',
        nickname: data.userName,
        password: data?.password ? Md5.hashStr(data.password) : '',
        payType: 'BANK_TRANSFER',
        repeatPassword: data?.repeatPassword
          ? Md5.hashStr(data.repeatPassword)
          : data?.password
          ? Md5.hashStr(data.password)
          : '',

        ...(data.isBindAll
          ? {
              bankName: '',
              lazyPassword: '',
            }
          : {
              withoutPayment: true,
              lazyPassword: '',
              bankName: '',
            }),
      });

      return {
        method: 'post',
        url: POST_PLAYER_INFORMATION_SAVE_URL,
        data: {
          reqData,
        },
      };
    },

    transformResponse,
  });

type PlayerInfoSaveResult = {
  payChannel: string;
  payMode: string;
  data: string;
};

const defaultResult = {
  payChannel: '',
  payMode: '',
  data: '',
};

const transformResponse = (
  response: ResponseStructure<PlayerInfoSaveResponse>
): PlayerInfoSaveResult => {
  const resp = response?.Body;
  if (resp) {
    return {
      payChannel: resp.PayChannel ?? defaultResult.payChannel,
      payMode: resp.PayMode ?? defaultResult.payMode,
      data: resp.Data ?? defaultResult.data,
    };
  }
  return defaultResult;
};
