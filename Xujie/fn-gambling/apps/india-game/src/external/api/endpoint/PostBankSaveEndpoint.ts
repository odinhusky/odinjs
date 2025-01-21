import { Md5 } from 'ts-md5';
import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_BANK_SAVE_URL } from '@/external/urls';

export interface UIBankSaveRequest {
  bankCode: string;
  ifsc: string;
  phone: string;
  realName: string;
  userName: string;
  password: string;
}

export interface ApiBankSaveRequest {
  bankCode: string;
  email: string; // ''
  ifsc: string;
  mobile: string;
  name: string;
  nickname: string;
  password: string; // MD5 string
  payType: string; // 'BANK_TRANSFER'
  repeatPassword: string; // MD5 string
}

/**
 * for [IN] 綁定錢包
 * @param builder
 * @constructor
 */
export const PostBankSaveEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<ResponseStructure<null>, UIBankSaveRequest>({
    query: (data: UIBankSaveRequest) => {
      const reqData: ApiBankSaveRequest = {
        bankCode: data.bankCode,
        email: '',
        ifsc: data.ifsc,
        mobile: data.phone,
        name: data.realName,
        nickname: data.userName,
        password: Md5.hashStr(data.password),
        payType: 'BANK_TRANSFER',
        repeatPassword: Md5.hashStr(data.password),
      };
      return {
        method: 'post',
        url: POST_BANK_SAVE_URL,
        data: reqData,
      };
    },
  });
