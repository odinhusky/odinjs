import { Md5 } from 'ts-md5';
import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_BANK_SAVE_URL } from '@/external/urls';

export type BankPayType = 'WALLET' | 'BANK TRANSFER';

// 前端要傳過來的參數
export interface UIBankSaveRequest {
  bankCardId?: number; // 編輯的時候有資料才帶
  bankCode: string;
  bankName: string;
  payType: BankPayType;

  cnic: string;
  phone: string;
  realName: string;
  userName: string;
  password: string;
}

// 實際上發送 API 應該要給的參數
export interface ApiBankSaveRequest {
  bankCardId?: number; // 只有編輯的時候有資料才會帶
  bankCode: string;
  bankName: string;
  payType: BankPayType;

  cnic: string;
  email: string;
  mobile: string;
  name: string;
  nickname: string;
  password: string; // MD5 string
  repeatPassword: string; // MD5 string
  withoutPayment?: boolean; // 只有新增的時候才有帶
}

/**
 * for [IN] 綁定錢包
 * @param builder
 * @constructor
 */
export const PostBankSaveEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<ResponseStructure<null>, UIBankSaveRequest>({
    query: (data: UIBankSaveRequest) => {
      const phone = data.phone.length <= 9 ? `03${data.phone}` : data.phone;

      const reqData: ApiBankSaveRequest = {
        bankCode:
          'WALLET' === data.payType ? `03${data.bankCode}` : `${data.bankCode}`,
        bankName: data.bankName,
        email: '',
        cnic: data.cnic,
        mobile: phone,
        name: data.realName,
        nickname: data.userName,
        password: Md5.hashStr(data.password),
        payType: data.payType,
        repeatPassword: Md5.hashStr(data.password),
      };

      if (data?.bankCardId) {
        reqData.bankCardId = data.bankCardId;
      }

      return {
        method: 'post',
        url: POST_BANK_SAVE_URL,
        data: reqData,
      };
    },
  });
