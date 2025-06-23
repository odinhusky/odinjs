import { POST_VIP_HOME_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import { extractApiMoneyString } from '@libs/commonUtils/extractApiMoneyString';

interface VipInfoResponse {
  Level?: number;
  RechargeAmount?: string; // "₹1,000,000"
  Turnover?: string; // "₹1,000,000"
  WithdrawTimes?: number;
  WithdrawAmount?: string; // "₹10,000,000"
  WithdrawRate?: string; // "₹0"
  TurnoverRate?: string; // "₹0"
  Reward?: string; // "₹20,000"
  MonthReward?: string; // "₹59,999"
  Received?: number; // 0
  ReceivedMonth?: number; // 0
  DailyBettingRebateRate?: number; // 每日投注返水率
  FreeDailyWithdrawals?: number; // 每日免費提現
}

interface VIPHomeResponse {
  VipLevel?: number;
  RechargeAmount?: string; // "89,266.00"
  Turnover?: string; // "0.00"
  LackRechargeAmount?: string; // "0.00"
  LackTurnover?: string; // "500.00"
  VipRechargeAmount?: string; // "50.00"
  VipTurnover?: string; // "500.00"
  WithdrawTimes?: number;
  WithdrawAmount?: string; // "5000.00"
  WithdrawRate?: string; // "0.030"
  VipInfos?: VipInfoResponse[];
  RewardDamaTimes?: number; // 打碼
}

/** VIP等級, VIP列表資料, 已充值金額, 投注金額百分比 */
export const PostVIPHomeEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<VIPHomeResult, void>({
    query: () => ({
      method: 'post',
      url: POST_VIP_HOME_URL,
      data: {
        reqData: {},
      },
    }),

    transformResponse,
  });

export enum BonusRecieveStatus {
  LOCK = 'lock',
  UNRECIEVED = 'unrecieved',
  RECIEVED = 'recieved',
  ONLY_DISPLAYED = 'onlyDisplayed',
}

export type VipInfo = {
  level: number;
  deposit: number;
  betAmount: number;
  levelUpgradeBonus: number;
  monthlyCashback: number;
  dailyWithdrawLimit: number;
  dailyBettingRebateRate: number;
  upgradeBonusRecieveStatus: BonusRecieveStatus;
  monthlyRewardRecieveStatus: BonusRecieveStatus;
  withdrawTimes: number;
  freeDailyWithdrawals: number;
};

type VIPHomeResult = {
  vipLevel: number;
  vipPercent: number;
  betAmountPercent: number;

  rechargeAmount: number;
  lackRechargeAmount: number;
  vipInfos: VipInfo[];
  rewardDamaTimes: number;
};

const defaultResult = {
  vipLevel: 0,
  vipPercent: 0,
  betAmountPercent: 0,
  rechargeAmount: 0,
  lackRechargeAmount: 0,
  rewardDamaTimes: 0,
  vipInfos: [],
};

const mapReceiveStatus = (value: number): BonusRecieveStatus => {
  if (value === 0) return BonusRecieveStatus.LOCK;
  else if (value === 1) return BonusRecieveStatus.UNRECIEVED;
  else if (value === 2) return BonusRecieveStatus.RECIEVED;
  return BonusRecieveStatus.LOCK;
};

const transformResponse = (
  response: ResponseStructure<VIPHomeResponse>
): VIPHomeResult => {
  const resp = response?.Body;
  if (resp) {
    const turnover = extractApiMoneyString(resp?.Turnover || '0');
    const vipTurnover = extractApiMoneyString(resp?.VipTurnover || '0');
    const betAmountPercent = Math.min((turnover / vipTurnover) * 100, 100);

    const rechargeAmount = extractApiMoneyString(resp?.RechargeAmount || '0');
    const vipRechargeTurnover = extractApiMoneyString(
      resp?.VipRechargeAmount || '0'
    );
    const vipPercent = Math.min(
      (rechargeAmount / vipRechargeTurnover) * 100,
      100
    );

    return {
      vipLevel: resp?.VipLevel || defaultResult.vipLevel,
      vipPercent: vipPercent,
      betAmountPercent: betAmountPercent,
      rechargeAmount: extractApiMoneyString(resp?.RechargeAmount || '0'),
      lackRechargeAmount: extractApiMoneyString(
        resp?.LackRechargeAmount || '0'
      ),
      rewardDamaTimes: resp?.RewardDamaTimes || 0,
      vipInfos:
        resp.VipInfos?.map((item) => ({
          level: item?.Level || 0,
          deposit: extractApiMoneyString(item?.RechargeAmount || '0'),
          betAmount: extractApiMoneyString(item?.Turnover || '0'),
          levelUpgradeBonus: extractApiMoneyString(item?.Reward || '0'),
          monthlyCashback: extractApiMoneyString(item?.MonthReward || '0'),
          dailyWithdrawLimit: extractApiMoneyString(
            item?.WithdrawAmount || '0'
          ),
          dailyBettingRebateRate: parseFloat(
            ((item.DailyBettingRebateRate || 0) * 100).toFixed(2)
          ),
          upgradeBonusRecieveStatus: mapReceiveStatus(item?.Received || 0),
          monthlyRewardRecieveStatus: mapReceiveStatus(
            item?.ReceivedMonth || 0
          ),
          withdrawTimes: item?.WithdrawTimes || 0,
          freeDailyWithdrawals: item?.FreeDailyWithdrawals || 0,
        })) || defaultResult.vipInfos,
    };
  }
  return defaultResult;
};
