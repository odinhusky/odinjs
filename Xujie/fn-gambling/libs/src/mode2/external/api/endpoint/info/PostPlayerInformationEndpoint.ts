import { POST_PLAYER_INFORMATION_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import { extractApiMoneyString } from '@libs/commonUtils/extractApiMoneyString';

export interface PlayerInformationResponse {
  PlayerId?: number;
  Level?: number;
  Nickname?: string;
  PlayerName?: string;
  Avatar?: string;
  AvatarFrame?: string;
  ReferenceCode?: string;
  RegistrationTime?: number;
  Currency?: string; // "INR"
  Email?: string;
  IsRecharge?: number; // 1
  WithdrawAccount?: WithdrawAccountResponse;
  RechargeAccount?: RechargeAccountResponse;
  LimitAmount?: string; // "142410.00"
  WithdrawAmount?: string; // "10165.60"
  TotalAssets?: string; // "152,575.60"
  WithdrawTimes?: number;
  WithdrawRate?: string; // "0.030"
  MaxWithdraw?: string; // "100,000.00"
  Turnover?: string; // "13936.20"
  RequireTurnover?: string; // "325900.00"
  RewardTimes?: number;
  RewardRate?: string; // "0.05"
  PlayerRewardTimes?: number;
  ChargeType?: number;
  Loading?: boolean;
  IsRisk?: boolean;
}

export interface RechargeAccountResponse {
  Id?: number;
  PlayerId?: number;
  Name?: string;
  Email?: string;
  Mobile?: string;
  PayType?: string;
  IsUpi?: number;
}

export interface WithdrawAccountResponse {
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
  IsUpi?: number; // 0:沒綁定過個人資訊 1: 綁定過個人資訊
  IsBank?: number;
  IsWallet?: number;
  BankName?: string;
  BankDisplayName?: string;
}

/** 玩家帳戶與資產相關資訊 */
export const PostPlayerInformationEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PlayerInfoResult, void>({
    query: () => ({
      method: 'post',
      url: POST_PLAYER_INFORMATION_URL,
      data: {
        reqData: {},
      },
    }),

    transformResponse,
  });

type bankAccountInfoResult = {
  realName: string;
  bankCode: string;
  ifsc: string;
};

export type PlayerInfoResult = {
  isBankFirstBind: boolean | null;
  isPersonalInfoFirstBind: boolean | null;
  isFirstDeposit: boolean | null;
  playerId: number;
  vipLevel: number;
  bankAccountInfo: bankAccountInfoResult;
  limitAmount: number;
  withdrawAmount: number;
  totalAssets: number;
  maxWithdraw: number;
  turnover: number;
  requireTurnover: number;
};

const defaultBankAccountInfo = {
  realName: '',
  bankCode: '',
  ifsc: '',
};

const defaultResult = {
  isBankFirstBind: true,
  isPersonalInfoFirstBind: true,
  isFirstDeposit: null,
  bankAccountInfo: defaultBankAccountInfo,
  playerId: 0,
  vipLevel: 0,
  turnover: 0,
  requireTurnover: 0,
  totalAssets: 0,
  limitAmount: 0,
  withdrawAmount: 0,
  maxWithdraw: 0,
};

const mapBankAccountInfo = (raw: WithdrawAccountResponse) => {
  return {
    realName: raw?.Name || defaultBankAccountInfo.realName,
    bankCode: raw?.BankCode || defaultBankAccountInfo.bankCode,
    ifsc: raw?.Ifsc || defaultBankAccountInfo.ifsc,
  };
};

const transformResponse = (
  response: ResponseStructure<PlayerInformationResponse>
): PlayerInfoResult => {
  const resp = response?.Body;
  if (resp) {
    const withdrawAccountResp = resp?.WithdrawAccount || {};
    const rechargeAccountResp = resp?.RechargeAccount || {};
    const isBankFirstBind =
      typeof withdrawAccountResp?.IsBank === 'number'
        ? withdrawAccountResp?.IsBank === 0
        : null; // 如果是 null 代表後端傳來的不是數字類型

    const isPersonalInfoFirstBind =
      typeof rechargeAccountResp?.IsUpi === 'number'
        ? rechargeAccountResp?.IsUpi === 0
        : null; // 如果是 null 代表後端傳來的不是數字類型

    const isFirstDeposit =
      typeof resp?.ChargeType === 'number' ? resp?.ChargeType === 1 : null;

    return {
      isBankFirstBind,
      isPersonalInfoFirstBind,
      isFirstDeposit,
      bankAccountInfo: mapBankAccountInfo(withdrawAccountResp),
      playerId: resp.PlayerId || defaultResult.playerId,
      vipLevel: resp?.Level || 0,
      maxWithdraw: extractApiMoneyString(resp?.MaxWithdraw || '0'),
      withdrawAmount: extractApiMoneyString(resp?.WithdrawAmount || '0'),
      limitAmount: extractApiMoneyString(resp?.LimitAmount || '0'),
      totalAssets: extractApiMoneyString(resp?.TotalAssets || '0'),
      turnover: extractApiMoneyString(resp.Turnover || '0'),
      requireTurnover: extractApiMoneyString(resp.RequireTurnover || '0'),
    };
  }
  return defaultResult;
};
