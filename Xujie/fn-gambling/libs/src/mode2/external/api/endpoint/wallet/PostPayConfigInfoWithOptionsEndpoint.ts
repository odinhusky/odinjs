import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_PAY_CONFIG_INFO_WITH_OPTIONS_URL } from '@mode2API/urls';

export interface PayConfigInfoResponse {
  Id?: number;
  Name?: string;
  Amount?: number;
  Rebate?: number;
  RebateAmount?: number;
  IsHot?: number; // 0 | 1
  CashBackRate?: number;
  CashBackAmount?: number;
  Recommended?: boolean;
  IsHighBonus?: boolean; // 支援高獎勵產品
  DamaTimes?: number;
  WithBonusDamaTimes?: number;
}

export interface PayConfigInfoWithOptionsResponse {
  PayChannelName?: string; // tpay_upi
  PayChannelDisplayName?: string; // "UpiPay",
  Configs?: PayConfigInfoResponse[];
  IsRecommend?: number;
  IsDefault?: boolean;
  IsAmountFixed?: boolean;
}

export interface PayOptionsResult {
  id: number;
  amount: number;
  name: string;
  rebate: number;
  rebateAmount: number; // 處理小數點後兩位
  isHot: boolean;
  cashBackRate: number; // 處理小數點後兩位
  cashBackAmount: number; // 處理小數點後兩位
  indexKey: string; // 方便 View 判斷比對
  fromChannelName: string;
  recommended: boolean;
  isHighBonus: boolean;
  damaTimes?: number; // 一般充值，提領下注倍率需求
  withBonusDamaTimes?: number; // Bonus充值，提領下注倍率需求
}

export type PayLimitResult = {
  min: number;
  max: number;
};

// 充值頁面開啟方式
export enum PayActivationResult {
  EXTERNAL = 'EXTERNAL',
  INTERNAL = 'INTERNAL',

  CRYPTO_WALLET = 'CRYPTO_WALLET',
  UPI = 'UPI',
  PHONEPE = 'PHONEPE',
}

export type PayChannelInfoResult = {
  payLimit: PayLimitResult; // 最大最小充值數
  displayName: string; // 支付通道名稱
  payName: string; // 調教充值訂單所需參數
  isRecommend: boolean; // 是否為推薦通道
  isDefaultSelected: boolean; // 預設被選取
  disableAmountInput: boolean; // 禁止手動輸入
  options: PayOptionsResult[];
  maxCashBackRate: number; // 當前渠道最大回饋率
  payActivation: PayActivationResult; // 是否使用內部開啟支付方式， iframe open || usdt adds
  // isInternalPayOpen: boolean; // 是否使用內部開啟支付方式， iframe open
  maxRebateAmount: number; // 當前渠道產品最大回扣金額
};

export interface PayConfigInfoWithOptionsResult {
  payChannels: PayChannelInfoResult[];
}

/**
 * 替代 [v1/api/pay/withdrawConfig]部分功能, 由此Transform 直接計算recharge限制 [min ~ max]
 * @param builder
 * @constructor
 */
export const PostPayConfigInfoWithOptionsEndpoint = (
  builder: ExternalEndpoint
) =>
  builder.mutation<PayConfigInfoWithOptionsResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_PAY_CONFIG_INFO_WITH_OPTIONS_URL,
        data: {
          reqData: {},
        },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<PayConfigInfoWithOptionsResponse[]>
): PayConfigInfoWithOptionsResult => {
  const resp: PayConfigInfoWithOptionsResponse[] = response.Body || [];

  const hasDefaultSelection = resp.some((item) => item.IsDefault === true);
  const payChannelItems = resp.flatMap((item, index) => {
    const configs = item.Configs || [];
    const channelName = item.PayChannelName;

    const options = configs.map((item) => {
      return {
        id: item.Id || 0,
        amount: item.Amount || 0,
        name: item.Name || '',
        rebate: item.Rebate || 0.0,
        rebateAmount: parseFloat((item.RebateAmount || 0).toFixed(2)),
        isHot: item.IsHot === 1,
        cashBackRate: parseFloat((item.CashBackRate || 0).toFixed(2)),
        cashBackAmount: parseFloat((item.CashBackAmount || 0).toFixed(2)),
        indexKey: `${item.Id}_${item.Name}_${item.Amount}_${item.RebateAmount}`,
        fromChannelName: channelName || '',
        recommended: item.Recommended || false,
        isHighBonus: item.IsHighBonus || false,
        damaTimes: item.DamaTimes || 0,
        withBonusDamaTimes: item.WithBonusDamaTimes || 0,
      };
    });
    const amounts = options.map((item) => item.amount);
    const cashBackRates = options.map((item) => item.cashBackRate);
    const rebateAmounts = options.map((item) => item.rebateAmount);

    return {
      payLimit: {
        min: Math.min(...amounts),
        max: Math.max(...amounts),
      },
      displayName: item.PayChannelDisplayName || '',
      payName: (item.PayChannelName || '').toLowerCase(), // 防呆全轉
      isRecommend: item.IsRecommend === 1,
      isDefaultSelected: hasDefaultSelection
        ? item.IsDefault === true
        : index === 0,
      disableAmountInput: item.IsAmountFixed === true,
      options: options,
      maxCashBackRate: Math.max(...cashBackRates),
      payActivation: PayActivationResult.EXTERNAL,
      maxRebateAmount: Math.max(...rebateAmounts),
      // payActivation:
      //   {
      //     tpay_upi: PayActivationResult.UPI,
      //     tpay_udst: PayActivationResult.CRYPTO_WALLET,
      //     dummypay: PayActivationResult.EXTERNAL,
      //     tpay: PayActivationResult.EXTERNAL,
      //   }[item.PayChannelName || ''] || PayActivationResult.EXTERNAL,
    };
  });

  return {
    payChannels: payChannelItems,
  };
};
