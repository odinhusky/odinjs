import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_WALLET_AND_OTHER_BANK_LIST_URL } from '@/external/urls';
import { get } from 'lodash';

export const EASYPAISA_FROM_API = {
  Code: 'EASYPAISA',
  Name: 'Easypaisa',
};

export const JAZZCASH_FROM_API = {
  Code: 'JAZZCASH',
  Name: 'Jazzcash',
};

export const EASYPAISA_TAB = {
  code: 'EASYPAISA',
  name: 'Easypaisa',
};

export const JAZZCASH_TAB = {
  code: 'JAZZCASH',
  name: 'Jazzcash',
};

export type WalletAndOtherBankUnit = {
  Code?: string;
  Name?: string;
};

export type WalletAndOtherBankListResponse = {
  Wallets?: WalletAndOtherBankUnit[];
  Banks?: WalletAndOtherBankUnit[];
};

export type RequiredWalletAndOtherBankUnit = {
  code: string;
  name: string;
};

export type BankOptionListUnit = {
  label: string;
  value: string;
};

export type WalletAndOtherBankListResult = {
  walletList: RequiredWalletAndOtherBankUnit[];
  bankOptionList: BankOptionListUnit[];
};

/**
 * 替代 [v1/api/pay/withdrawConfig]部分功能, 由此Transform 直接計算recharge限制 [min ~ max]
 * @param builder
 * @constructor
 */
export const PostWalletAndOtherBankListEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<WalletAndOtherBankListResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_WALLET_AND_OTHER_BANK_LIST_URL,
        data: {
          reqData: {},
        },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<WalletAndOtherBankListResponse>
): WalletAndOtherBankListResult => {
  const defaultWallet = [
    { ...EASYPAISA_TAB },
    { ...JAZZCASH_TAB },
  ] as RequiredWalletAndOtherBankUnit[];

  const defaultBanks = [
    { value: 'DUMMY_BANK_CODE', label: 'DummyBankName' },
  ] as BankOptionListUnit[];

  const apiWallets = get(response.Body, 'Wallets');
  const apiBanks = get(response.Body, 'Banks');

  const transformedWallets = apiWallets
    ? apiWallets
        .flatMap((item) =>
          item?.Code && item?.Name
            ? {
                code: item.Code,
                name: item.Name,
              }
            : []
        )
        .sort((a, b) => a.name.localeCompare(b.name))
    : defaultWallet;

  const transformedBanks = apiBanks
    ? apiBanks
        .flatMap((item) =>
          item?.Code && item?.Name
            ? {
                label: item.Name,
                value: item.Code,
              }
            : []
        )
        .sort((a, b) => a.value.localeCompare(b.value))
    : defaultBanks;

  const result: WalletAndOtherBankListResult = {
    walletList: transformedWallets,
    bankOptionList: transformedBanks,
  };

  return result;
};
