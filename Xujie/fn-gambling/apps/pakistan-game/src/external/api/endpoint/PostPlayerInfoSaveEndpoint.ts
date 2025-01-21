import { Md5 } from 'ts-md5';
import { POST_PLAYER_INFORMATION_SAVE_URL } from '@/external/urls';
import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import sortKeys from 'sort-keys';
import { BankPayType } from './PostBankSaveEndpoint';

// 前端傳入的參數接口
export interface UIPlayerInfoSaveRequest {
  isBindAll: boolean; // 是否同時綁定個人和銀行資訊
  phone: string;
  userName: string;

  bankCode?: string;
  bankName?: string;
  cnic?: string;
  realName?: string;
  password?: string;
  repeatPassword?: string;
  payType?: BankPayType;
}

// API 發送的請求接口
export interface ApiPlayerInfoSaveRequest {
  bankCode: string;
  bankName?: string;
  email?: string;
  cnic?: string;
  name?: string;

  mobile: string;
  nickname: string;
  password: string; // MD5 string
  payType: BankPayType; // 常量，如 'WALLET' | 'BANK TRANSFER'
  repeatPassword: string; //  MD5 string
  withoutPayment: boolean;
}

type PlayerInfoSaveResponse = {
  PayChannel: string;
  PayMode: string;
  Data: string;
};

/**
 * 同時綁定個人資訊＆銀行資訊
 * 或者只綁定個人資訊
 */
export const PostPlayerInfoSaveEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PlayerInfoSaveResult, UIPlayerInfoSaveRequest>({
    query: (data: UIPlayerInfoSaveRequest) => {
      const payType = data.payType || ('WALLET' as BankPayType);
      const isOtherBanks = payType === 'BANK TRANSFER';
      const bankCode = isOtherBanks
        ? data?.bankCode || '04' // 理論上 isOtherBanks === true 代表兩者都要一起存，代表 bankCode 一定會有值，04代表非預期錯誤
        : data?.bankCode
        ? `03${data.bankCode}`
        : '03';

      const phone = data.phone.length <= 9 ? `03${data.phone}` : data.phone;

      const reqData: ApiPlayerInfoSaveRequest = sortKeys({
        bankCode,
        mobile: phone,
        nickname: data.userName,
        password: data?.password ? Md5.hashStr(data.password) : '',
        payType,
        repeatPassword: data?.repeatPassword
          ? Md5.hashStr(data.repeatPassword)
          : data?.password
          ? Md5.hashStr(data.password)
          : '',

        ...(data.isBindAll
          ? {
              bankName: data?.bankName || '04',
              cnic: data.cnic || '',
              name: data.realName || '',
              email: '',
              withoutPayment: false,
            }
          : {
              withoutPayment: true,
            }),
      });

      return {
        method: 'post',
        url: POST_PLAYER_INFORMATION_SAVE_URL,
        data: reqData,
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
      payChannel: resp.PayChannel,
      payMode: resp.PayMode,
      data: resp.Data,
    };
  }
  return defaultResult;
};
