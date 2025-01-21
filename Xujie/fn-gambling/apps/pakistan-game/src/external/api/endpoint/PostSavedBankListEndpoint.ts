import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_SAVED_BANK_LIST_URL } from '@/external/urls';
import { get } from 'lodash';

export type SavedBankListResponse = {
  Id?: number;
  PlayerId?: number;
  Name?: string;
  Email?: string;
  Mobile?: string;
  BankCode?: string;
  Ifsc?: string;
  Vpa?: string;
  CNIC?: string;
  Password?: string;
  CreateTime?: number;
  Enabled?: number;
  IsUpi?: number;
  IsBank?: number;
  IsWallet?: number;
  BankName?: string;
  BankDisplayName?: string;
};

export interface SavedBankListResult {
  id: number;
  // playerId: number;
  name: string;
  email: string;
  // mobile: string;
  bankCode: string;
  // ifsc: string;
  vpa: string;
  cnic: string;
  password: string;
  createTime: number;
  // enabled: number;
  // isUpi: number;
  isBank: number;
  isWallet: number;
  bankName: string;
  bankDisplayName: string;
}

// 取得已經儲存的 Wallet 或是 Other Bank 的詳細資料
export const PostSavedBankListEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<SavedBankListResult[], void>({
    query: () => {
      return {
        method: 'post',
        url: POST_SAVED_BANK_LIST_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<SavedBankListResponse[]>
): SavedBankListResult[] => {
  const data = response?.Body;

  const resp: SavedBankListResult[] =
    data && data.length > 0
      ? data
          // .filter((item) => {
          //   return !item?.Id || item?.Id <= 0;
          // })
          .map((item) => ({
            id: get(item, 'Id', 0),
            // playerId: get(item, 'PlayerId', 0),
            name: get(item, 'Name', ''),
            email: get(item, 'Email', ''),
            // mobile: get(item, 'Mobile', ''),
            bankCode: get(item, 'BankCode', ''),
            // ifsc: get(item, 'Ifsc', ''),
            vpa: get(item, 'Vpa', ''),
            cnic: get(item, 'CNIC', ''),
            password: get(item, 'Password', ''),
            createTime: get(item, 'CreateTime', 0),
            // enabled: get(item, 'Enabled', 0),
            // isUpi: get(item, 'IsUpi', 0),
            isBank: get(item, 'IsBank', 0),
            isWallet: get(item, 'IsWallet', 0),
            bankName: get(item, 'BankName', ''),
            bankDisplayName: get(item, 'BankDisplayName', ''),
          }))
      : [];

  return resp;
};
